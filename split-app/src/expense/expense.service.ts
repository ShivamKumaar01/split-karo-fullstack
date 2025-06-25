import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';
import { Expense } from './entities/expense.entity';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SplitService } from 'src/split/split.service';
import { Split } from 'src/split/entities/split.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
    private readonly UserService: UserService,
    private readonly groupService: GroupService,
    private readonly splitService: SplitService,
    private readonly mailService: MailService,

  ) { }

  async create(createExpenseDto: CreateExpenseDto) {
    const groupid = createExpenseDto.groupId;
    const userid = createExpenseDto.paidBy;
    const amount = createExpenseDto.amount;

    const existGroup = await this.groupService.findOne(groupid);
    if (!existGroup) {
      throw new NotFoundException('Group not found');
    }

    const existUser = await this.UserService.findOne(userid);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }


    const expense = new Expense();
    expense.description = createExpenseDto.description;
    expense.amount = amount;
    expense.paidBy = { id: userid } as any;
    expense.group = { id: groupid } as any;

    const savedExpense = await this.expenseRepository.save(expense);


    const members = await this.groupService.getGroupMembers(groupid);
    const perPerson = parseFloat((amount / members.length).toFixed(2));


    for (const member of members) {
      if (member.id === userid) continue;

      const split = new Split();
      split.amount = perPerson;
      split.status = 'owed';
      split.user = { id: member.id } as any;
      split.expense = { id: savedExpense.id } as any;

      await this.splitService.saveSplit(split);

      
      await this.mailService.sendMail({
        to: member.email,
        subject: 'New Expense in Group - ' + existGroup.title,
        template: 'split-notification', 
        context: {
          name: member.name,
          groupName: existGroup.title,
          paidBy: existUser.name,
          description: createExpenseDto.description,
          amount: amount,
          splitAmount: perPerson
        }
      });
    }

    return {
      message: 'Expense created, splits saved, and emails sent!',
      expense: savedExpense
    };
  }






  findAll() {
    return `This action returns all expense`;
  }

  findOne(id: number) {
    return this.expenseRepository.findOne({ where: { id }, relations: ['splits', 'paidBy', 'group'] });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['splits', 'group', 'paidBy'],
    });

    if (!expense) throw new NotFoundException('Expense not found');

    if (updateExpenseDto.description) expense.description = updateExpenseDto.description;
    if (updateExpenseDto.amount) expense.amount = updateExpenseDto.amount;

    const updatedExpense = await this.expenseRepository.save(expense);

    
    for (const split of expense.splits) {
      await this.splitService.remove(split.id);
    }

    const members = await this.groupService.getGroupMembers(expense.group.id);
    const perPerson = parseFloat((expense.amount / members.length).toFixed(2));

    for (const member of members) {
      if (member.id === expense.paidBy.id) continue;

      const split = new Split();
      split.amount = perPerson;
      split.status = 'owed';
      split.user = { id: member.id } as any;
      split.expense = { id: expense.id } as any;

      await this.splitService.saveSplit(split);
    }

    return {
      message: 'Expense updated and splits re-generated',
      updatedExpense,
    };
  }

  async remove(id: number) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['splits'],
    });

    if (!expense) throw new NotFoundException('Expense not found');

    for (const split of expense.splits) {
      await this.splitService.remove(split.id);
    }

    await this.expenseRepository.remove(expense);

    return {
      message: 'Expense and related splits deleted',
    };
  }

  async findByGroup(groupId: number) {
    return this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy'], 
      
    });
  }


  async getTotalExpenseByGroup(groupId: number) {
  const result = await this.expenseRepository
    .createQueryBuilder('expense')
    .select('SUM(expense.amount)', 'total')
    .where('expense.groupId = :groupId', { groupId })
    .getRawOne();

  return { totalExpense: parseFloat(result.total) || 0 };
}

async getUserOwedInGroup(groupId: number, userId: number) {
  const result = await this.splitService.splitRepository
    .createQueryBuilder('split')
    .select('SUM(split.amount)', 'owed')
    .innerJoin('split.expense', 'expense')
    .where('expense.groupId = :groupId', { groupId })
    .andWhere('split.userId = :userId', { userId })
    .andWhere("split.status = 'owed'")
    .getRawOne();

  return { userOwes: parseFloat(result.owed) || 0 };
}

}
