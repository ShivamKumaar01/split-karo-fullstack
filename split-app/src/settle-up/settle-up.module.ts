import { Module } from '@nestjs/common';
import { SettleUpService } from './settle-up.service';
import { SettleUpController } from './settle-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettleUp } from './entities/settle-up.entity';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([SettleUp]),UserModule,GroupModule],
  controllers: [SettleUpController],
  providers: [SettleUpService],
})
export class SettleUpModule {}
