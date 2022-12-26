import { PaymentOrdersRecordEntity } from '@common/entities';
import {
  Events,
  PaymentAnaliticsStatuses,
  PaymentOrderStatuses,
} from '@common/enums';
import { catchErrorHandler } from '@common/handler';
import {
  RecordBalancePayload,
  TrackAnaliticsPayload,
} from '@common/interfaces';
import { BaseService } from '@common/services';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import { UserApproveOrderRequest } from '../dto';

@Injectable()
export class UserOrderApproveService extends BaseService<
  [number, UserApproveOrderRequest],
  PaymentOrdersRecordEntity
> {
  constructor(
    private readonly dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }
  protected execute(
    orderId: number,
    dto: UserApproveOrderRequest,
  ): Observable<any> {
    return this.checkIsOrderExist(orderId).pipe(
      switchMap((order) => {
        return this.dataSource
          .getRepository(PaymentOrdersRecordEntity)
          .save({ ...order, status: dto.status });
      }),
      tap((updatedOrder) => {
        const { tarrif, userId } = updatedOrder;
        this.recordAnalytics({
          userId,
          price: tarrif?.price,
          currency: tarrif?.currency,
          tarrifTitle: tarrif?.title,
          status:
            dto.status === PaymentOrderStatuses.Approved
              ? PaymentAnaliticsStatuses.PAYMENT_COMPLETE
              : PaymentAnaliticsStatuses.PAYMENT_FAILED,
        });
        if (dto.status === PaymentOrderStatuses.Approved) {
          this.recordBalanceChanged({
            userId,
            creditCount: tarrif?.creditCount,
          });
        }
      }),
      catchErrorHandler(),
    );
  }
  private checkIsOrderExist(
    orderId: number,
  ): Observable<PaymentOrdersRecordEntity> {
    return from(
      this.dataSource
        .getRepository(PaymentOrdersRecordEntity)
        .findOne({ where: { id: orderId }, relations: ['tarrif'] }),
    ).pipe(
      tap((order) => {
        if (!order || order?.status !== PaymentOrderStatuses.Created)
          throw new BadRequestException('Current order isn`t ready!');
      }),
      map((order) => order),
    );
  }

  private recordAnalytics(payload: TrackAnaliticsPayload): void {
    this.eventEmitter.emit(Events.RecordAnalitycs, payload);
  }

  private recordBalanceChanged(payload: RecordBalancePayload): void {
    this.eventEmitter.emit(Events.RecordBalanceChanged, payload);
  }
}
