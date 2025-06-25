import { IsNumber } from 'class-validator';

export class RemoveGroupMemberDto {
  @IsNumber()
  groupId: number;

  @IsNumber()
  userId: number;
}