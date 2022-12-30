import { CreditTariffsCurrency, PaymentAnalyticsStatuses } from '@common/enums';

export interface AnalyticsOrderAttributes {
  orderId: number;

  price: number;

  currency: CreditTariffsCurrency;

  tariffTitle: string;

  status: PaymentAnalyticsStatuses;
}
