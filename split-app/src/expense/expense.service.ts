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
    @InjectRepository(Expense)private readonly expenseRepository:Repository<Expense>
,    private readonly UserService:UserService,
    private readonly groupService:GroupService,
    private readonly splitService: SplitService,
    private readonly mailService: MailService,

  ){}
 
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

    // 📧 Send email
    await this.mailService.sendMail({
      to: member.email,
      subject: 'New Expense in Group - ' + existGroup.title,
      template: 'split-notification', // ❗️Make sure this template exists
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

    return this.expenseRepository.findOne({where:{id:id}})
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
