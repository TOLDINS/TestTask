import ActivityStatus from '@common/enums/user-activity-status.enum';
import { UserRepositiory } from '@common/modules';
import { ErrorHandlerService } from '@common/modules/error-handler';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { DataSource, EntityTarget } from 'typeorm';

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
    repositorys: {
      user: {
        findOne: async (query: { where: { id: number } }) => {
          let result = null;
          if (query.where.id === mocks.user.id) {
            result = mocks.user;
          }
          return result;
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserShowBalanceService,
        {
          provide: UserRepositiory,
          useValue: mocks.repositorys.user,
        },
      ],
    }).compile();

    service = module.get<UserShowBalanceService>(UserShowBalanceService);
  });

  it('Test for working with a user not found', async () => {
    try {
      await service.run(3);
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });

  it('User test with a successful execution result', async () => {
    const result = await lastValueFrom(service.run(1));
    expect(result).toEqual({
      userId: mocks.user.id,
      userName: mocks.user.name,
      balance: mocks.user.balanceRecord.getBalance(),
    });
  });
});
