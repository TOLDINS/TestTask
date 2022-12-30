import { RepositoryModule } from '@common/modules';
import { ErrorHandlerModule } from '@common/modules/error-handler';
import { Module } from '@nestjs/common';

import { PaymentOrdersController } from './controllers/payment-orders.controller';
import { CreateOrderService, OrderUpdateStatusService } from './services';

@Module({
  imports: [ErrorHandlerModule],
  controllers: [PaymentOrdersController],
  providers: [CreateOrderService, OrderUpdateStatusService],
})
export class OrdersModule {}
