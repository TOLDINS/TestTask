import { Global, Module } from '@nestjs/common';
import { AnalyticsRecordRepository } from './analytics-order.repository';
import { CreditTariffRepository } from './credit-tariff.repository';
import { PaymentOrderRepository } from './payment-orders.repository';
import { UserBalanceRecordRepository } from './user-balance-record.repository';
import { UserRepositiory } from './user.repository';
@Global()
@Module({
  providers: [
    UserBalanceRecordRepository,
    UserRepositiory,
    CreditTariffRepository,
    PaymentOrderRepository,
    AnalyticsRecordRepository,
  ],
  exports: [
    UserBalanceRecordRepository,
    UserRepositiory,
    CreditTariffRepository,
    PaymentOrderRepository,
    AnalyticsRecordRepository,
  ],
})
export class RepositoryModule {}
