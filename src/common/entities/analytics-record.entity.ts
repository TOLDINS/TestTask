import { AnalyticsSubjectTypes } from '@common/enums';
import { AnalyticsOrderAttributes } from '@common/interfaces/analytics/attributes';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('analytics_record')
export class AnalyticsRecord<Attr extends AnalyticsOrderAttributes> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'action_subject_type', type: 'varchar' })
  actionSubjectType: AnalyticsSubjectTypes;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ type: 'jsonb', nullable: false })
  attributes: Attr;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;
}
