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

import { CreditTarrifs } from './credit-tariffs.entity';

@Entity('payment_orders_record')
export class PaymentOrdersRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'tarrif_id' })
  @Index()
  tarrifId: number;

  @ManyToOne(() => CreditTarrifs, (tarrif) => tarrif.orders)
  @JoinColumn([{ name: 'tarrif_id', referencedColumnName: 'id' }])
  tarrif: CreditTarrifs;

  @Column({ type: 'varchar' })
  status: PaymentOrderStatuses;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
