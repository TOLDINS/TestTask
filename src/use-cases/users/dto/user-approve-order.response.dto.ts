import { CreditTarrifsCurrency, PaymentOrderStatuses } from '@common/enums';

interface CreditTarrifData {
  id: number;
  title: string;
  price: number;
  currency: CreditTarrifsCurrency;
  creditCount: number;
}

export interface UserApproveOrderResponseDto {
  id: number;
  userId: number;
  tarrifId: number;
  status: PaymentOrderStatuses;
  createdAt: Date;
  tarrif: CreditTarrifData;
}
