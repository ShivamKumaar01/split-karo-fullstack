import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
    @IsString()
    title: string

    @IsString()
    description:string

    @IsOptional()
    userid:number



}
