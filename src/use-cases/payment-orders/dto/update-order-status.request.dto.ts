import { PaymentOrderStatuses } from '@common/enums';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusRequestDto {
  @IsEnum(PaymentOrderStatuses)
  status: PaymentOrderStatuses;
}
