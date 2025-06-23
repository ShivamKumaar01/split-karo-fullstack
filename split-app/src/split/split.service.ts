import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSplitDto } from './dto/create-split.dto';
import { UpdateSplitDto } from './dto/update-split.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Split } from './entities/split.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ExpenseService } from 'src/expense/expense.service';

@Injectable()
export class SplitService {
  constructor(
    @InjectRepository(Split) private readonly splitRepository:Repository<Split>,
    private readonly userService:UserService,
    // private readonly expenseService:ExpenseService
        @Inject(forwardRef(() => ExpenseService)) 
    private readonly expenseService: ExpenseService


){}
  async create(createSplitDto: CreateSplitDto) {
    // const userid=createSplitDto.userId
    // const expenseid=createSplitDto.expenseId
    // const existUser=await this.userService.findOne(userid)
    // if(!userid){
    //   throw new NotFoundException("user not found with this id")
    // }
    // const existExpense=await this.expenseService.findOne(expenseid)
    // if(!existExpense){
    //   throw new NotFoundException("expense not found with this id")
    // }
    // const split=new Split()
    
    return 'This action adds a new split';
  }
  async saveSplit(split: Split): Promise<Split> {
  return this.splitRepository.save(split);
}

  findAll() {
    return `This action returns all split`;
  }

  findOne(id: number) {
    return `This action returns a #${id} split`;
  }

  update(id: number, updateSplitDto: UpdateSplitDto) {
    return `This action updates a #${id} split`;
  }

  remove(id: number) {
    return `This action removes a #${id} split`;
  }
}
