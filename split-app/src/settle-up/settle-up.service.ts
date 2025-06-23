import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettleUpDto } from './dto/create-settle-up.dto';
import { UpdateSettleUpDto } from './dto/update-settle-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SettleUp } from './entities/settle-up.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class SettleUpService {
    constructor(
    @InjectRepository(SettleUp)
    private readonly settleUpRepo: Repository<SettleUp>,
    private readonly userService: UserService,
    private readonly groupService: GroupService
  ) {}
  async create(createSettleUpDto: CreateSettleUpDto) {
    const { payerId, payeeId, amount, groupId } = createSettleUpDto;

    const payer = await this.userService.findOne(payerId);
    if (!payer) throw new NotFoundException('Payer not found');

    const payee = await this.userService.findOne(payeeId);
    if (!payee) throw new NotFoundException('Payee not found');

    const group = await this.groupService.findOne(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const settle = new SettleUp();
    settle.amount = amount;
    settle.payer = payer;
    settle.payee = payee;
    settle.group = group;

    const saved = await this.settleUpRepo.save(settle);

    return {
      message: 'Settle up successful',
      data: saved,
    };
  }

  findAll() {
    return `This action returns all settleUp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} settleUp`;
  }

  update(id: number, updateSettleUpDto: UpdateSettleUpDto) {
    return `This action updates a #${id} settleUp`;
  }

  remove(id: number) {
    return `This action removes a #${id} settleUp`;
  }
}
