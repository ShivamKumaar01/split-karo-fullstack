import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SplitService } from './split.service';
import { CreateSplitDto } from './dto/create-split.dto';
import { UpdateSplitDto } from './dto/update-split.dto';

@Controller('split')
export class SplitController {
  constructor(private readonly splitService: SplitService) {}

  @Post()
  create(@Body() createSplitDto: CreateSplitDto) {
    return this.splitService.create(createSplitDto);
  }

  @Get()
  findAll() {
    return this.splitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.splitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSplitDto: UpdateSplitDto) {
    return this.splitService.update(+id, updateSplitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.splitService.remove(+id);
  }
    @Get('expense/:expenseId')
  getSplitsByExpense(@Param('expenseId') expenseId: string) {
    return this.splitService.getSplitsByExpense(+expenseId);
  }
}
