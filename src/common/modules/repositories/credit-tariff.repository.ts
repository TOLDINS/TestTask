import { CreditTariffs } from '@common/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CreditTariffRepository extends Repository<CreditTariffs> {
  constructor(private readonly dataSource: DataSource) {
    super(CreditTariffs, dataSource.createEntityManager());
  }
}
