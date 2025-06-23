import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports:[TypeOrmModule.forFeature([User]),GroupMemberModule,CloudinaryModule],
    imports: [
    PassportModule,
    JwtModule.register({
      secret: 'shivamSecret',
      signOptions: { expiresIn: '1h' },
    }),TypeOrmModule.forFeature([User]),GroupMemberModule,CloudinaryModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
