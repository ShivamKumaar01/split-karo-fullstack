import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string


    @Column()
    description:string

    // @Column()
    // createdby:number

    @CreateDateColumn()
    createdat:Date

    @ManyToOne(()=>User,(user)=>user.groups)
    user:User


    // @ManyToOne(()=>User)
    // // @JoinColumn()
    // createdby:User

    // @ManyToMany(()=>User,(user)=>user.groups)
    // users:User[]
}
