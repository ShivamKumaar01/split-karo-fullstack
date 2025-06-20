import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    description:string

    @Column()
    amount:string

    @Column()
    category:string

    @Column()
    paidBy:number
}
