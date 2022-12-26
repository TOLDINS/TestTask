import { PaymentOrdersRecordEntity } from '@common/entities';
import { PaymentOrderStatuses } from '@common/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityTarget } from 'typeorm';

import { UserOrderApproveService } from './user-approve-order.service';

describe('UserApproveOrderService', () => {
  let service: UserOrderApproveService;

  const mocks = {
    paymentOrder: {
      id: 1,
      userId: 1,
      tarrifId: 2,
      status: PaymentOrderStatuses.Created,
    },
    requsetDto: {
      valid: {
        status: PaymentOrderStatuses.Approved,
        orderId: 1,
      },
      unvalid: {
        status: 'invalid',
        orderId: 'invalid',
      },
    },
    dataSource: {
      getRepository: (target: EntityTarget<any>) => {
        const repository = {
          PaymentOrdersRecordEntity: {
            findOne: async (query: { where: { id: number } }) => {
              let result = null;
              if (query.where.id === mocks.paymentOrder.id) {
                result = mocks.paymentOrder;
              }
              return result;
            },
            save: async (data: {
              userId: number;
              tarrifId: number;
              status: PaymentOrderStatuses;
            }) => {
              return data as PaymentOrdersRecordEntity;
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
        UserOrderApproveService,
        {
          provide: DataSource,
          useValue: mocks.dataSource,
        },
        { provide: EventEmitter2, useValue: {} },
      ],
    }).compile();

    service = module.get<UserOrderApproveService>(UserOrderApproveService);
  });

  it('dto should is incorrect', async () => {
    try {
      await service.run(mocks.requsetDto.unvalid.orderId as unknown as number, {
        status: mocks.requsetDto.unvalid
          .status as unknown as PaymentOrderStatuses,
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
    }
  });

  it('shoud payment order is already', async () => {
    try {
      await service.run(2, {
        status: mocks.requsetDto.valid.status,
      });
    } catch (error) {
      expect(error.response.message).toEqual('Current order isn`t ready!');
    }
  });
});
