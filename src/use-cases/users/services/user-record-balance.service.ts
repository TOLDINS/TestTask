import { UserBalanceRecord } from '@common/entities';
import { RecordChangeBalancePayload } from '@common/interfaces';
import { UserBalanceRecordRepository } from '@common/modules';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersRecordBalanceService {
  private logger = new Logger(UsersRecordBalanceService.name);
  constructor(
    private readonly userBalanceRepository: UserBalanceRecordRepository,
  ) {}

  @OnEvent('users.change-record-balance', { promisify: true })
  async handleChangesRecordBalance(
    payload: RecordChangeBalancePayload,
  ): Promise<void> {
    try {
      const balanceRecord = await this.userBalanceRepository.findOne({
        where: { userId: payload.userId },
      });
      const recordBalanceData: UserBalanceRecord =
        this.userBalanceRepository.create(
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

      await this.userBalanceRepository.save({ ...recordBalanceData });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
