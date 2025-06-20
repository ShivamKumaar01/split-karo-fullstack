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
    const id=createGroupDto?.userid
    const user=await this.userService.findOne(id)
    if(!user){
      throw new NotFoundException("there is no such user with this user id")
    }
    const existGroup=await this.findByName(name)
    if(existGroup){
      throw new ConflictException("this group name is already exist")
    }
    const group=new Group()
    group.title=name
    group.description=createGroupDto.description
    group.user={id:createGroupDto.userid} as any
    this.groupRepository.save(group)
    return {message:"group registered successfully",group}
  }

  findAll() {
    return this.groupRepository.find();
  }

  findOne(id: number) {
    return this.groupRepository.findOne({where:{id:id}});
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
}
