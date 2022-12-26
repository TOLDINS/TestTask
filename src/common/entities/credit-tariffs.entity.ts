import { CreditTarrifsCurrency } from '@common/enums';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PaymentOrdersRecordEntity } from './payment-orders-record.entity';

@Entity('credit_tarrifs')
export class CreditTarrifs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'varchar' })
  currency: CreditTarrifsCurrency;

  @Column({ name: 'credit_count', type: 'real' })
  creditCount: number;

  @OneToMany(() => PaymentOrdersRecordEntity, (record) => record.tarrif)
  orders: PaymentOrdersRecordEntity;
}
