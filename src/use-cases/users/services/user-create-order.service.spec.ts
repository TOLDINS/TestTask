import { PaymentOrdersRecordEntity } from '@common/entities';
import { PaymentOrderStatuses } from '@common/enums';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityTarget } from 'typeorm';

import { UserCreateOrderRequestDto } from '../dto';

import { UserCreateOrderService } from './user-create-order.service';

describe('UserCreateOrderService', () => {
  let service: UserCreateOrderService;
  const mocks = {
    user: {
      id: 1,
      name: 'AXEL',
      status: ActivityStatus.Active,
    },

    tarrif: {
      id: 1,
      title: 'Base',
      price: 10,
      cuurency: 'usd',
      creditCount: 50,
    },
    requsetDto: {
      valid: {
        userId: 1,
        tarrifId: 1,
      },
      unvalid: {
        userId: 'asdasdasdasdads',
        tarrifId: 1,
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
          CreditTarrifs: {
            findOne: async (query: { where: { id: number } }) => {
              let result = null;

              if (query.where.id === mocks.tarrif.id) {
                result = mocks.tarrif;
              }
              return result;
            },
          },
          PaymentOrdersRecordEntity: {
            save: async (data: {
              userId: number;
              tarrifId: number;
              status: PaymentOrderStatuses;
            }): Promise<PaymentOrdersRecordEntity> => {
              const res = {
                id: 1,
                userId: data.userId,
                tarrifId: data.tarrifId,
                status: data.status,
              } as PaymentOrdersRecordEntity;
              return Promise.resolve(res);
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
        UserCreateOrderService,
        {
          provide: DataSource,
          useValue: mocks.dataSource,
        },
        { provide: EventEmitter2, useValue: {} },
      ],
    }).compile();

    service = module.get<UserCreateOrderService>(UserCreateOrderService);
  });

  it('dto should is incorrect', async () => {
    try {
      await service.run({
        ...(mocks.requsetDto.unvalid as unknown as UserCreateOrderRequestDto),
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
    }
  });

  it('shoud user is already', async () => {
    try {
      await service.run({ userId: 22, tarrifId: 1 });
    } catch (error) {
      expect(error.response.message).toEqual('User isn`t ready or not found');
    }
  });

  it('shoud credit tarrif is already', async () => {
    try {
      await service.run({ userId: 1, tarrifId: 2 });
    } catch (error) {
      expect(error.response.message).toEqual(
        'Credit Tarrif isn`t ready or not found',
      );
    }
  });
});
