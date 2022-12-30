import { PaymentOrdersRecord } from '@common/entities';
import {
  AnalyticsSubjectTypes,
  Events,
  PaymentAnalyticsStatuses,
  PaymentOrderStatuses,
} from '@common/enums';
import {
  RecordChangeBalancePayload,
  TrackOrderAnalyticsPayload,
} from '@common/interfaces';
import { PaymentOrderRepository } from '@common/modules';
import { ErrorHandlerService } from '@common/modules/error-handler';
import { BaseService } from '@common/services';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import {
  UpdateOrderStatusRequestDto,
  UpdateOrderStatusResponseDto,
} from '../dto';

@Injectable()
export class OrderUpdateStatusService extends BaseService<
  [number, UpdateOrderStatusRequestDto],
  UpdateOrderStatusResponseDto
> {
  constructor(
    private readonly paymentOrderRepository: PaymentOrderRepository,
    private eventEmitter: EventEmitter2,
    private errorHandler: ErrorHandlerService,
  ) {
    super();
  }
  protected execute(
    orderId: number,
    dto: UpdateOrderStatusRequestDto,
  ): Observable<UpdateOrderStatusResponseDto> {
    return this.checkIsOrderExist(orderId).pipe(
      switchMap((order) => {
        return this.paymentOrderRepository.save({
          ...order,
          status: dto.status,
        });
      }),
      tap((updatedOrder) => {
        const { tariff, userId, id } = updatedOrder;
        this.recordAnalytics({
          userId,
          actionSubjectType: AnalyticsSubjectTypes.Orders,
          attributes: {
            orderId: id,
            price: tariff?.price,
            currency: tariff?.currency,
            tariffTitle: tariff?.title,
            status:
              dto.status === PaymentOrderStatuses.Approved
                ? PaymentAnalyticsStatuses.PAYMENT_COMPLETE
                : PaymentAnalyticsStatuses.PAYMENT_FAILED,
          },
        });
        if (dto.status === PaymentOrderStatuses.Approved) {
          this.recordBalanceChanged({
            userId,
            creditCount: tariff?.creditCount,
          });
        }
      }),
      this.errorHandler.catchError(),
    );
  }
  private checkIsOrderExist(orderId: number): Observable<PaymentOrdersRecord> {
    return from(
      this.paymentOrderRepository.findOne({
        where: { id: orderId },
        relations: ['tariff'],
      }),
    ).pipe(
      tap((order) => {
        if (!order || order?.status !== PaymentOrderStatuses.Created)
          throw new BadRequestException('Current order isn`t ready!');
      }),
      map((order) => order),
    );
  }

  private recordAnalytics(payload: TrackOrderAnalyticsPayload): void {
    this.eventEmitter.emit(Events.TrackOrderTariffAnalytics, payload);
  }

  private recordBalanceChanged(payload: RecordChangeBalancePayload): void {
    this.eventEmitter.emit(Events.RecordBalanceChanged, payload);
  }
}
