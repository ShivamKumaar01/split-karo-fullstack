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
    @InjectRepository(Split) public readonly splitRepository: Repository<Split>,
    private readonly userService: UserService,
    
    @Inject(forwardRef(() => ExpenseService))
    private readonly expenseService: ExpenseService


  ) { }
  async create(createSplitDto: CreateSplitDto) {
  

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

  async remove(id: number) {
    const split = await this.splitRepository.findOne({ where: { id } });
    if (!split) throw new NotFoundException('Split not found');
    await this.splitRepository.remove(split);
  }


  async getSplitsByExpense(expenseId: number) {
  return this.splitRepository.find({
    where: { expense: { id: expenseId } },
    relations: ['user'],
  });
}
}
