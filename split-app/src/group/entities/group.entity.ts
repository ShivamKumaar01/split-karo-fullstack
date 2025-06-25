import { Expense } from "src/expense/entities/expense.entity";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { SettleUp } from "src/settle-up/entities/settle-up.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column()
    description:string

    @CreateDateColumn()
    createdat:Date

    @ManyToOne(()=>User,(user)=>user.groups)
    user:User


    @OneToMany(()=>Expense,(expense)=>expense.group)
    expenses:Expense[]


    @OneToMany(()=>SettleUp,(settleups)=>settleups.group)
    settlements:SettleUp[]

    @OneToMany(()=>GroupMember,(groupmember)=>groupmember.group)
    groupmembers:GroupMember[]



}
