import { CreditTariffsCurrency } from '@common/enums';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PaymentOrdersRecord } from './payment-orders-record.entity';

@Entity('credit_tariffs')
export class CreditTariffs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'varchar' })
  currency: CreditTariffsCurrency;

  @Column({ name: 'credit_count', type: 'real' })
  creditCount: number;

  @OneToMany(() => PaymentOrdersRecord, (record) => record.tariff)
  orders: PaymentOrdersRecord;
}
