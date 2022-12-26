import { IsNumber } from 'class-validator';

export class UserCreateOrderRequestDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  tarrifId: number;
}
