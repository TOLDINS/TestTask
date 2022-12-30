import { PaymentOrdersRecord } from '@common/entities';
import { PaymentOrderStatuses } from '@common/enums';
import { PaymentOrderRepository } from '@common/modules';
import { ErrorHandlerService } from '@common/modules/error-handler';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityTarget } from 'typeorm';

import { OrderUpdateStatusService } from './order-update-status.service';

describe('OrderUpdateStatusService', () => {
  let service: OrderUpdateStatusService;

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
    respositorys: {
      paymentOrder: {
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
          return data as unknown as PaymentOrdersRecord;
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderUpdateStatusService,
        {
          provide: PaymentOrderRepository,
          useValue: mocks.respositorys.paymentOrder,
        },
        { provide: EventEmitter2, useValue: {} },
        { provide: ErrorHandlerService, useValue: {} },
      ],
    }).compile();

    service = module.get<OrderUpdateStatusService>(OrderUpdateStatusService);
  });

  it('Test with invalid input dto', async () => {
    try {
      await service.run(mocks.requsetDto.unvalid.orderId as unknown as number, {
        status: mocks.requsetDto.unvalid
          .status as unknown as PaymentOrderStatuses,
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
    }
  });

  it('Test with finished payment order', async () => {
    try {
      await service.run(2, {
        status: mocks.requsetDto.valid.status,
      });
    } catch (error) {
      expect(error.response.message).toEqual('Current order isn`t ready!');
    }
  });
});
