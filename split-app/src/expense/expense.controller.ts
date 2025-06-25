import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }

@Get('/group/:groupId')
getExpensesByGroup(@Param('groupId') groupId: number) {
  return this.expenseService.findByGroup(groupId);
}


@Get('/group/:groupId/total')
getTotalExpense(@Param('groupId') groupId: number) {
  return this.expenseService.getTotalExpenseByGroup(+groupId);
}

@UseGuards(JwtAuthGuard)
@Get('group/:groupId/owed')
getUserOwedInGroup(
  @Param('groupId') groupId: string,
  @Req() req: Request,
) {
  const user = req.user as { userId: number };
  return this.expenseService.getUserOwedInGroup(+groupId, user.userId);
}



}
