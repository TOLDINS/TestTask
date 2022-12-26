import { Test, TestingModule } from '@nestjs/testing';

import { UserOrderApproveService } from '../services/user-approve-order.service';
import { UserCreateOrderService } from '../services/user-create-order.service';
import { UserShowBalanceService } from '../services/user-show-balance.service';

import { UsersController } from './users.controller';
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserCreateOrderService, useValue: {} },
        { provide: UserOrderApproveService, useValue: {} },
        { provide: UserShowBalanceService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
