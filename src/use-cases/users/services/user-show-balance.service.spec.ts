import { PaymentOrdersRecordEntity } from '@common/entities';
import { PaymentOrderStatuses } from '@common/enums';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { DataSource, EntityTarget } from 'typeorm';

import { UserCreateOrderRequestDto } from '../dto';

import { UserCreateOrderService } from './user-create-order.service';
import { UserShowBalanceService } from './user-show-balance.service';

describe('UserShowBalanceService', () => {
  let service: UserShowBalanceService;

  const mocks = {
    user: {
      id: 1,
      name: 'AXEL',
      status: ActivityStatus.Active,
      balanceRecord: {
        debit: 70,
        credit: 20,
        getBalance: (): number => {
          return (
            mocks.user.balanceRecord.debit - mocks.user.balanceRecord.credit
          );
        },
      },
    },
    dataSource: {
      getRepository: (target: EntityTarget<any>) => {
        const repository = {
          User: {
            findOne: async (query: { where: { id: number } }) => {
              let result = null;
              if (query.where.id === mocks.user.id) {
                result = mocks.user;
              }
              return result;
            },
          },
        };

        return repository[(target as any).name];
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserShowBalanceService,
        {
          provide: DataSource,
          useValue: mocks.dataSource,
        },
      ],
    }).compile();

    service = module.get<UserShowBalanceService>(UserShowBalanceService);
  });

  it('should be is user not found!', async () => {
    try {
      await service.run(3);
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });

  it('should be is success result', async () => {
    const result = await lastValueFrom(service.run(1));
    expect(result).toEqual({
      userId: mocks.user.id,
      userName: mocks.user.name,
      balance: mocks.user.balanceRecord.getBalance(),
    });
  });
});
