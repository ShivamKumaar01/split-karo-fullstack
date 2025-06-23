import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettleUpService } from './settle-up.service';
import { CreateSettleUpDto } from './dto/create-settle-up.dto';
import { UpdateSettleUpDto } from './dto/update-settle-up.dto';

@Controller('settle-up')
export class SettleUpController {
  constructor(private readonly settleUpService: SettleUpService) {}

  @Post()
  create(@Body() createSettleUpDto: CreateSettleUpDto) {
    return this.settleUpService.create(createSettleUpDto);
  }

  @Get()
  findAll() {
    return this.settleUpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settleUpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettleUpDto: UpdateSettleUpDto) {
    return this.settleUpService.update(+id, updateSettleUpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settleUpService.remove(+id);
  }
}
