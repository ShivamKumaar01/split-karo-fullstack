import { IsNumber } from "class-validator";

export class CreateSettleUpDto {
     @IsNumber()
  payerId: number;

  @IsNumber()
  payeeId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  groupId: number;
}
