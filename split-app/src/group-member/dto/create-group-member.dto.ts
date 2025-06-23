import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class CreateGroupMemberDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  userIds: number[];

    @IsNumber()
    groupId: number;
}


