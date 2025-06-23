import { IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  paidBy: number; 

  @IsNumber()
  groupId: number;
}
