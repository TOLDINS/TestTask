import { UserBalanceRecord } from '@common/entities';
import { RecordBalancePayload } from '@common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRecordBalanceListener {
  private logger = new Logger(UsersRecordBalanceListener.name);
  constructor(private readonly dataSource: DataSource) {}

  @OnEvent('users.change-record-balance', { promisify: true })
  async handleChangesRecordBalance(
    payload: RecordBalancePayload,
  ): Promise<void> {
    try {
      const balanceRecordRepository =
        this.dataSource.getRepository(UserBalanceRecord);
      const balanceRecord = await balanceRecordRepository.findOne({
        where: { userId: payload.userId },
      });
      const recordBalanceData: UserBalanceRecord =
        balanceRecordRepository.create(
          balanceRecord
            ? {
                ...balanceRecord,
                debit: balanceRecord.debit + payload.creditCount,
              }
            : {
                userId: payload.userId,
                debit: payload.creditCount,
                credit: 0,
              },
        );

      await balanceRecordRepository.save({ ...recordBalanceData });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
