import {
  Controller,
  Post,
  Body,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  UpdateOrderStatusRequestDto,
  UpdateOrderStatusResponseDto,
} from '../dto';
import { CreateOrderService, OrderUpdateStatusService } from '../services';

@Controller('/orders')
export class PaymentOrdersController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly orderUpdateStatusService: OrderUpdateStatusService,
  ) {}

  @Post('/create')
  initOrder(
    @Body() dto: CreateOrderRequestDto,
  ): Observable<CreateOrderResponseDto> {
    return this.createOrderService.run(dto);
  }

  @Put('/update')
  approveOrder(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusRequestDto,
  ): Observable<UpdateOrderStatusResponseDto> {
    return this.orderUpdateStatusService.run(orderId, dto);
  }
}
