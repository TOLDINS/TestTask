import ActivityStatus from '@common/enums/user-activity-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
} from 'typeorm';

import { UserBalanceRecord } from './user-balnce-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column({ default: ActivityStatus.Active })
  status: ActivityStatus;

  @OneToOne(() => UserBalanceRecord, (record) => record.user)
  balanceRecord: UserBalanceRecord;
}
