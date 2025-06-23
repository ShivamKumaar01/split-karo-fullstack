import { Expense } from "src/expense/entities/expense.entity";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { Group } from "src/group/entities/group.entity";
import { SettleUp } from "src/settle-up/entities/settle-up.entity";
import { Split } from "src/split/entities/split.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", unique: true })
  email: string

  @Column({ type: "varchar" })
  password: string


  @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
  gender: string;

  @Column({ nullable: true })
  profilePic: string


  @CreateDateColumn()
  createdAt: Date

 

  @OneToMany(() => Group, (group) => group.user)
  groups: Group[]

  @OneToMany(() => Expense, expense => expense.paidBy)
  expensesPaid: Expense[];

  @OneToMany(()=>GroupMember,(groupMembers)=>groupMembers.user)
  groupMembers:GroupMember[]

  @OneToMany(()=>Split,(split)=>split.user)
  splits:Split[]

  // @OneToMany(()=>SettleUp,(settlements)=>settlements.payee)
  // settlements: SettleUp[]

    @OneToMany(() => SettleUp, s => s.payer)
  paymentsMade: SettleUp[];

  @OneToMany(() => SettleUp, s => s.payee)
  paymentsReceived: SettleUp[];



 



}
