import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('users_balance_record ')
export class UserBalanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToOne(() => User, (user) => user.balanceRecord)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column({
    type: 'real',
    default: 0,
    transformer: {
      from: (val: string) => Number(val),
      to: (val: number) => val,
    },
  })
  debit: number;

  @Column({
    type: 'real',
    default: 0,
    transformer: {
      from: (val: string) => Number(val),
      to: (val: number) => val,
    },
  })
  credit: number;

  getBalance(): number {
    return this.debit - this.credit;
  }
}
