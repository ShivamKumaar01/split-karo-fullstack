
import { IsArray, IsEmail, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string
    
    @IsString()
    password: string

    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    profilePic:string
    
    @IsEnum(['m', 'f', 'u'], { message: 'gender must be m, f or u' })
    gender: string;

    
    @IsOptional()
    @IsArray()
    groupIds?:number[]
}