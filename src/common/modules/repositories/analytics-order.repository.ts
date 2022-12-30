import { AnalyticsRecord } from '@common/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AnalyticsRecordRepository extends Repository<
  AnalyticsRecord<any>
> {
  constructor(private readonly dataSource: DataSource) {
    super(AnalyticsRecord, dataSource.createEntityManager());
  }
}
