import { ErrorHandlerModule } from '@common/modules/error-handler';
import { Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { UsersRecordBalanceService } from './services/user-record-balance.service';
import { UserShowBalanceService } from './services/user-show-balance.service';

@Module({
  imports: [ErrorHandlerModule],
  controllers: [UsersController],
  providers: [UserShowBalanceService, UsersRecordBalanceService],
})
export class UsersModule {}
