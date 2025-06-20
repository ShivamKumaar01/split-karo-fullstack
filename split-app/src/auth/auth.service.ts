import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { signUpDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { LoginUserDto } from './dto/login.dto';
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class AuthService {
  constructor(private readonly userService:UserService,
    @InjectRepository(User)private readonly userRepository:Repository<User>,
    private jwtService: JwtService
  ){}
  async create(createAuthDto: signUpDto) {
    const email=createAuthDto.email
    const name=createAuthDto.name
    const plainpassword=createAuthDto.password
    const gender=createAuthDto.gender

    const existUser = await this.findByEmail(createAuthDto.email)
    if (existUser) {
      throw new ConflictException('this email is  already exists');
    }
    const user: User = new User()
    user.name = name
    user.email = email
    const password = plainpassword
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword
    user.gender = createAuthDto.gender
  
    this.userRepository.save(user)
  
    return { message: 'User registered successfully' };

  }

 


  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } })
    return user;
  }


  async Login(email:string,password:string){
    // console.log(email,password,"this is from service")
    // return { message: 'User login successfully' }; 
    console.log(process.env.SECRET)
  const user = await this.findByEmail(email);
  if (!user) {
    throw new NotFoundException();
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new NotFoundException();
  }

  const payload = { sub: user.id, useremail: user.email };
  // const token = this.jwtService.sign(payload); 
  const token = this.jwtService.sign(payload, {
  secret: process.env.SECRET,
  expiresIn: '1h'
});

  return { details: token, user };
    
  }


}
