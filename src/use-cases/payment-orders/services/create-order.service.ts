import { CreditTariffs, PaymentOrdersRecord, User } from '@common/entities';
import {
  AnalyticsSubjectTypes,
  Events,
  PaymentAnalyticsStatuses,
  PaymentOrderStatuses,
} from '@common/enums';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { TrackOrderAnalyticsPayload } from '@common/interfaces';
import {
  CreditTariffRepository,
  PaymentOrderRepository,
  UserRepositiory,
} from '@common/modules';
import { ErrorHandlerService } from '@common/modules/error-handler';
import { BaseService } from '@common/services';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { combineLatest, from, map, Observable, switchMap, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import { CreateOrderRequestDto, CreateOrderResponseDto } from '../dto';

@Injectable()
export class CreateOrderService extends BaseService<
  [CreateOrderRequestDto],
  CreateOrderResponseDto
> {
  constructor(
    private eventEmitter: EventEmitter2,
    private errorHandler: ErrorHandlerService,
    private userRepository: UserRepositiory,
    private creditTariffRepository: CreditTariffRepository,
    private paymentOrderRepository: PaymentOrderRepository,
  ) {
    super();
  }

  protected execute(
    dto: CreateOrderRequestDto,
  ): Observable<CreateOrderResponseDto> {
    return this.checkIsAllow(dto).pipe(
      switchMap(({ user, tariff }) => {
        return from(
          this.paymentOrderRepository.save({
            userId: user.id,
            tariffId: dto.tariffId,
            tariff,
            status: PaymentOrderStatuses.Created,
          }),
        ).pipe(
          tap((order) => {
            const { tariff: tariffData, userId, id } = order;
            this.recordAnalytics({
              userId,
              actionSubjectType: AnalyticsSubjectTypes.Orders,
              attributes: {
                orderId: id,
                price: tariffData?.price,
                currency: tariffData?.currency,
                tariffTitle: tariffData?.title,
                status: PaymentAnalyticsStatuses.INITIATE_CHECKOUT,
              },
            });
          }),
          map((order) => ({ orderId: order.id })),
        );
      }),
      this.errorHandler.catchError(),
    );
  }

  private checkIsAllow(
    dto: CreateOrderRequestDto,
  ): Observable<{ user: User; tariff: CreditTariffs }> {
    return combineLatest([
      this.userRepository.findOne({ where: { id: dto.userId } }),
      this.creditTariffRepository.findOne({ where: { id: dto.tariffId } }),
    ]).pipe(
      tap(([user, tariff]) => {
        if (!user || user?.status !== ActivityStatus.Active)
          throw new BadRequestException('User isn`t ready or not found');
        if (!tariff)
          throw new BadRequestException(
            'Credit Tarriff isn`t ready or not found',
          );
      }),
      map(([user, tariff]) => ({ user, tariff })),
    );
  }

  private recordAnalytics(payload: TrackOrderAnalyticsPayload): void {
    this.eventEmitter.emit(Events.TrackOrderTariffAnalytics, payload);
  }
}
