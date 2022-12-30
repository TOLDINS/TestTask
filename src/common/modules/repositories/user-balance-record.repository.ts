import { UserBalanceRecord } from '@common/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserBalanceRecordRepository extends Repository<UserBalanceRecord> {
  constructor(private readonly dataSource: DataSource) {
    super(UserBalanceRecord, dataSource.createEntityManager());
  }
}
