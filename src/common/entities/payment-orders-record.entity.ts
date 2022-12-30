import { PaymentOrderStatuses } from '@common/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { CreditTariffs } from './credit-tariffs.entity';

@Entity('payment_orders_record')
export class PaymentOrdersRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'tariff_id' })
  @Index()
  tariffId: number;

  @ManyToOne(() => CreditTariffs, (tariff) => tariff.orders)
  @JoinColumn([{ name: 'tariff_id', referencedColumnName: 'id' }])
  tariff: CreditTariffs;

  @Column({ type: 'varchar' })
  status: PaymentOrderStatuses;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
