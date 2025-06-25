import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login.dto';
import { Response } from 'express'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  create(@Body() createAuthDto: signUpDto) {
    return this.authService.create(createAuthDto);
  }




  @Post('login')
  async login(@Body() loginDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { email, password } = loginDto;
    const tokenData = await this.authService.Login(email, password)


    res.cookie('token', tokenData.details, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return {
      message: 'Logged in successfully',
      name: tokenData.user.name,
      email: tokenData.user.email,
      token:tokenData.details
    };
  }







}
