import { IsNumber } from 'class-validator';

export class CreateOrderRequestDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  tariffId: number;
}
