import { IsIn, IsNumber, IsString } from "class-validator";

export class CreateSplitDto {
  @IsNumber()
  amount: number;

  // @IsString()
  // status: string; // 'owed' | 'paid'
   @IsIn(['owed', 'paid'], {
    message: 'Status must be either "owed" or "paid"',
  })
  status: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  expenseId: number;
}
