import { Module } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import { GroupMember } from './entities/group-member.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Group,GroupMember])],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports:[GroupMemberService]
})
export class GroupMemberModule {}
