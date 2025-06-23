import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import * as multer from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
@Get(':id/groups')
getGroupsOfUser(
  @Param('id') id: number,
  @Query('page') page: string,
  @Query('limit') limit: string
) {
  return this.userService.getGroupsWhereUserIsMember(
    +id,
    parseInt(page) || 1,
    parseInt(limit) || 10
  );
}


@Patch(':email')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
update(
  @Param('email') email: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() req: Request,
) {
  return this.userService.update(email, file);
}


}
