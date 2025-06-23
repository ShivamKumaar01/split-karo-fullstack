// split.entity.ts
import { Expense } from 'src/expense/entities/expense.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { Expense } from 'src/expense/expense.entity';
// import { User } from 'src/user/user.entity';

@Entity()
export class Split {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  amount: number;

  @Column({ default: 'owed' }) // status can be 'owed' or 'paid'
  status: string;

  @ManyToOne(()=>User,(user)=>user.splits)
  user: User;

  @ManyToOne(()=>Expense,(expense)=>expense.splits)
  expense: Expense;
  

//   @ManyToOne(() => Expense, expense => expense.splits)
//   expense: Expense;

//   @ManyToOne(() => User, user => user.splits)
//   user: User;
// }

}