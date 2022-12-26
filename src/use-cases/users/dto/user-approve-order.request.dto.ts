import { PaymentOrderStatuses } from '@common/enums';
import { IsEnum } from 'class-validator';

export class UserApproveOrderRequest {
  @IsEnum(PaymentOrderStatuses)
  status: PaymentOrderStatuses;
}
