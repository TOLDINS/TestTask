import {
  CreditTarrifs,
  PaymentOrdersRecordEntity,
  User,
} from '@common/entities';
import {
  Events,
  PaymentAnaliticsStatuses,
  PaymentOrderStatuses,
} from '@common/enums';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { catchErrorHandler } from '@common/handler';
import { TrackAnaliticsPayload } from '@common/interfaces';
import { BaseService } from '@common/services';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { combineLatest, from, map, Observable, switchMap, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import { UserCreateOrderRequestDto } from '../dto';

@Injectable()
export class UserCreateOrderService extends BaseService<
  [UserCreateOrderRequestDto],
  number
> {
  constructor(
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  protected execute(dto: UserCreateOrderRequestDto): Observable<number> {
    return this.checkIsAllow(dto).pipe(
      switchMap(({ user, tarrif }) => {
        return from(
          this.dataSource.getRepository(PaymentOrdersRecordEntity).save({
            userId: user.id,
            tarrifId: dto.tarrifId,
            tarrif,
            status: PaymentOrderStatuses.Created,
          }),
        ).pipe(
          tap((order) => {
            const { tarrif: tarifData, userId } = order;
            this.recordAnalytics({
              userId,
              price: tarifData?.price,
              currency: tarifData?.currency,
              tarrifTitle: tarifData?.title,
              status: PaymentAnaliticsStatuses.INITIATE_CHECKOUT,
            });
          }),
          map((order) => order.id),
        );
      }),
      catchErrorHandler(),
    );
  }

  private checkIsAllow(
    dto: UserCreateOrderRequestDto,
  ): Observable<{ user: User; tarrif: CreditTarrifs }> {
    const userRepository = this.dataSource.getRepository(User);
    const tarrifRepository = this.dataSource.getRepository(CreditTarrifs);

    return combineLatest([
      userRepository.findOne({ where: { id: dto.userId } }),
      tarrifRepository.findOne({ where: { id: dto.tarrifId } }),
    ]).pipe(
      tap(([user, tarrif]) => {
        if (!user || user?.status !== ActivityStatus.Active)
          throw new BadRequestException('User isn`t ready or not found');
        if (!tarrif)
          throw new BadRequestException(
            'Credit Tarrif isn`t ready or not found',
          );
      }),
      map(([user, tarrif]) => ({ user, tarrif })),
    );
  }

  private recordAnalytics(payload: TrackAnaliticsPayload): void {
    this.eventEmitter.emit(Events.RecordAnalitycs, payload);
  }
}
