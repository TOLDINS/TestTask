import { PaymentOrdersRecord } from '@common/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PaymentOrderRepository extends Repository<PaymentOrdersRecord> {
  constructor(private readonly dataSource: DataSource) {
    super(PaymentOrdersRecord, dataSource.createEntityManager());
  }
}
