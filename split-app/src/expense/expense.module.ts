import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { Expense } from './entities/expense.entity';
import { SplitModule } from 'src/split/split.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense,User,Group]),UserModule,GroupModule,SplitModule,MailModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports:[ExpenseService]
})
export class ExpenseModule {}
