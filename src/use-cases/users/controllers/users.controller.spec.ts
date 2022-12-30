import { Test, TestingModule } from '@nestjs/testing';

import { UserShowBalanceService } from '../services/user-show-balance.service';

import { UsersController } from './users.controller';
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UserShowBalanceService, useValue: {} }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
