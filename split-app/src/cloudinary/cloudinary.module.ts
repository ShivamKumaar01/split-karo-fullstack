import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }),TypeOrmModule.forFeature([User])],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports:[CloudinaryService]
})
export class CloudinaryModule {}