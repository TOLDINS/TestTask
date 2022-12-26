import { Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { TrackAnaliticsListener } from './listeners/analitics-track.listener';
import { UsersRecordBalanceListener } from './listeners/users-record-balance.listener';
import { UserOrderApproveService } from './services/user-approve-order.service';
import { UserCreateOrderService } from './services/user-create-order.service';
import { UserShowBalanceService } from './services/user-show-balance.service';

@Module({
  controllers: [UsersController],
  providers: [
    UserCreateOrderService,
    UserOrderApproveService,
    UserShowBalanceService,
    TrackAnaliticsListener,
    UsersRecordBalanceListener,
  ],
})
export class UsersModule {}
