import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { Group } from 'src/group/entities/group.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private groupMemberRepo: Repository<GroupMember>,

    @InjectRepository(Group)
    private groupRepo: Repository<Group>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
  }
  async create(createGroupMemberDto: CreateGroupMemberDto) {
    const { groupId, userIds } = createGroupMemberDto;


    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');


    const users = await this.userRepo.findBy({ id: In(userIds) });
    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }


    const existingMembers = await this.groupMemberRepo.find({
      where: {
        group: { id: groupId },
        user: In(userIds),
      },
      relations: ['user'],
    });

    const existingUserIds = new Set(
      existingMembers.map((member) => member.user.id)
    );

    const newUsers = users.filter((user) => !existingUserIds.has(user.id));

    if (newUsers.length === 0) {
      throw new ConflictException('All users are already in the group');
    }

   
    const groupMembersToSave = newUsers.map((user) => {
      const member = new GroupMember();
      member.user = user;
      member.group = group;
      return member;
    });

    const saved = await this.groupMemberRepo.save(groupMembersToSave);

    return {
      message: 'New users added to the group',
      addedMembers: saved,
    };
  }


  findAll() {
    return `This action returns all groupMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupMember`;
  }

  update(id: number, updateGroupMemberDto: UpdateGroupMemberDto) {
    return `This action updates a #${id} groupMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupMember`;
  }
  addMember() {

  }


  async getGroupsWhereUserIsMember(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [memberships, total] = await this.groupMemberRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['group'],
      skip,
      take: limit,
    });

    const groups = memberships.map((m) => m.group);

    return {
      totalGroups: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      groups,
    };
  }

 
 async removeUserFromGroup(groupId: number, userId: number) {
  const groupMember = await this.groupMemberRepo.findOne({
    where: {
      group: { id: groupId },
      user: { id: userId },
    },
    relations: ['group', 'user'],
  });

  if (!groupMember) {
    throw new NotFoundException('User is not part of this group');
  }

  await this.groupMemberRepo.remove(groupMember);

  return {
    message: `User ${userId} removed from group ${groupId}`,
  };
}


}
