import { CreditTarrifsCurrency, PaymentAnaliticsStatuses } from '@common/enums';

export interface TrackAnaliticsPayload {
  userId: number;
  price: number;
  currency: CreditTarrifsCurrency;
  tarrifTitle: string;
  status: PaymentAnaliticsStatuses;
}
