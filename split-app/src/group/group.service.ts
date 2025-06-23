import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly groupRepository:Repository<Group>,
    @InjectRepository(User) private readonly userRepository:Repository<User>,
    private readonly userService:UserService

){}
  async create(createGroupDto: CreateGroupDto) {
    const name=createGroupDto.title
    
    const existGroup=await this.findByName(name)
    if(existGroup){
      throw new ConflictException("this group name is already exist")
    }
    const group=new Group()
    group.title=name
    group.description=createGroupDto.description
    group.user={id:createGroupDto.createdBy} as any
    this.groupRepository.save(group)
    return {message:"group registered successfully",group}
  }

  async getGroupMembers(groupId: number) {
  const group = await this.groupRepository.findOne({
    where: { id: groupId },
    relations: ['groupmembers', 'groupmembers.user'],
  });

  if (!group) {
    throw new NotFoundException('Group not found');
  }

  return group.groupmembers.map((gm) => gm.user);
}

  findAll() {
    return this.groupRepository.find();
  }

  findOne(id: number) {
    return this.groupRepository.findOne({where:{id:id}});
  }

  async findInWhichUserIs(userId:number){
    const membership=await this.groupRepository.find({
    where: { user: { id: userId } },
    relations: ['group'],
  });
  return membership;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }

  findByName(name:string){
    return this.groupRepository.findOne({where:{title:name}})
  }

  async GroupInUser(id:number){
    const user=this.userService.findOne(id)
    if(!user){
      throw new NotFoundException('User not found')
    }


  }


}
