import { PartialType } from '@nestjs/mapped-types';
import { CreateSettleUpDto } from './create-settle-up.dto';

export class UpdateSettleUpDto extends PartialType(CreateSettleUpDto) {}
