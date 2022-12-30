import { CreditTariffsCurrency, PaymentOrderStatuses } from '@common/enums';

interface CreditTarrifData {
  id: number;
  title: string;
  price: number;
  currency: CreditTariffsCurrency;
  creditCount: number;
}

export interface UpdateOrderStatusResponseDto {
  id: number;
  userId: number;
  tariffId: number;
  status: PaymentOrderStatuses;
  createdAt: Date;
  tariff: CreditTarrifData;
}
