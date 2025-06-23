import { forwardRef, Module } from '@nestjs/common';
import { SplitService } from './split.service';
import { SplitController } from './split.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/expense/entities/expense.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ExpenseModule } from 'src/expense/expense.module';
import { Split } from './entities/split.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Expense,Split]),UserModule,forwardRef(() => ExpenseModule)],
  controllers: [SplitController],
  providers: [SplitService],
  exports:[SplitService]
})
export class SplitModule {}
