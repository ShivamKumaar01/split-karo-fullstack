import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GroupMemberService } from 'src/group-member/group-member.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly groupMemberService: GroupMemberService,
    private jwtService: JwtService, private readonly cloudinaryService: CloudinaryService

  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  getGroupsWhereUserIsMember(userId: number, page: number, limit: number) {
    return this.groupMemberService.getGroupsWhereUserIsMember(userId, page, limit);
  }


  async update(email: string, file: Express.Multer.File) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Upload image to Cloudinary
    const result = await this.cloudinaryService.uploadImage(file);

    // Update profilePic with Cloudinary URL
    user.profilePic = result.secure_url;

    await this.userRepository.save(user);

    return {
      message: 'User Profile Picture has been updated',
      profilePic: user.profilePic,
      user,
    };
  }


  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } })
    return user;
  }
}





