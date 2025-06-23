// expense.entity.ts
import { Group } from 'src/group/entities/group.entity';
import { Split } from 'src/split/entities/split.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
// import { Group } from 'src/group/group.entity';
// import { User } from 'src/user/user.entity';
// import { Split } from 'src/split/split.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('float')
  amount: number;

//   @ManyToOne(() => Group, group => group.expenses)
//   group: Group;

  @ManyToOne(() => User, user => user.expensesPaid)
  paidBy: User;

  @ManyToOne(()=>Group,(group)=>group.expenses)
  group: Group;
  
  @OneToMany(()=>Split,(split)=>split.expense)
  splits: Split[]

//   @OneToMany(() => Split, split => split.expense)
//   splits: Split[];
}
