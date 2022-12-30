import { PaymentOrdersRecord } from '@common/entities';
import { PaymentOrderStatuses } from '@common/enums';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import {
  CreditTariffRepository,
  PaymentOrderRepository,
  UserRepositiory,
} from '@common/modules';
import { ErrorHandlerService } from '@common/modules/error-handler';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrderRequestDto } from '../dto';

import { CreateOrderService } from './create-order.service';

describe('CreateOrderService', () => {
  let service: CreateOrderService;
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
      creditTarrifs: {
        findOne: async (query: { where: { id: number } }) => {
          let result = null;

          if (query.where.id === mocks.tarrif.id) {
            result = mocks.tarrif;
          }
          return result;
        },
      },

      paymentOrder: {
        save: async (data: {
          userId: number;
          tarrifId: number;
          status: PaymentOrderStatuses;
        }): Promise<PaymentOrdersRecord> => {
          const res = {
            id: 1,
            userId: data.userId,
            tariffId: data.tarrifId,
            status: data.status,
          } as PaymentOrdersRecord;
          return Promise.resolve(res);
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderService,
        {
          provide: UserRepositiory,
          useValue: mocks.repositorys.user,
        },
        {
          provide: CreditTariffRepository,
          useValue: mocks.repositorys.creditTarrifs,
        },
        {
          provide: PaymentOrderRepository,
          useValue: mocks.repositorys.paymentOrder,
        },

        { provide: EventEmitter2, useValue: {} },
        { provide: ErrorHandlerService, useValue: {} },
      ],
    }).compile();

    service = module.get<CreateOrderService>(CreateOrderService);
  });

  it('Test with invalid input dto', async () => {
    try {
      await service.run({
        ...(mocks.requsetDto.unvalid as unknown as CreateOrderRequestDto),
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
    }
  });

  it('Test with  non-existent user', async () => {
    try {
      await service.run({ userId: 22, tariffId: 1 });
    } catch (error) {
      expect(error.response.message).toEqual('User isn`t ready or not found');
    }
  });

  it('Test with  non-existent credit tariff', async () => {
    try {
      await service.run({ userId: 1, tariffId: 2 });
    } catch (error) {
      expect(error.response.message).toEqual(
        'Credit Tariff isn`t ready or not found',
      );
    }
  });
});
