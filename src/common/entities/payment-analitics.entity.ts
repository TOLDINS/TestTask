import { CreditTarrifsCurrency, PaymentAnaliticsStatuses } from '@common/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payment_analitics')
export class PaymentAnalitics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'varchar' })
  currency: CreditTarrifsCurrency;

  @Column({ name: 'tarrif_title', type: 'varchar' })
  tarrifTitle: string;

  @Column({ type: 'varchar' })
  status: PaymentAnaliticsStatuses;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
