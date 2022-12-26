import { PaymentOrdersRecordEntity } from '@common/entities';
import {
  Controller,
  Post,
  Body,
  Put,
  Query,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  UserApproveOrderRequest,
  UserCreateOrderRequestDto,
  UserShowBalanceResponse,
} from '../dto';
import { UserOrderApproveService } from '../services/user-approve-order.service';
import { UserCreateOrderService } from '../services/user-create-order.service';
import { UserShowBalanceService } from '../services/user-show-balance.service';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly userCreateOrderService: UserCreateOrderService,
    private readonly userApproveOrderService: UserOrderApproveService,
    private readonly userShowBalanceService: UserShowBalanceService,
  ) {}

  @Get('show-balance')
  showUserBalance(
    @Query('userId', ParseIntPipe) userId: number,
  ): Observable<UserShowBalanceResponse> {
    return this.userShowBalanceService.run(userId);
  }

  @Post('order')
  initOrder(@Body() dto: UserCreateOrderRequestDto): Observable<number> {
    return this.userCreateOrderService.run(dto);
  }

  @Put('order-approve')
  approveOrder(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UserApproveOrderRequest,
  ): Observable<PaymentOrdersRecordEntity> {
    return this.userApproveOrderService.run(orderId, dto);
  }
}
