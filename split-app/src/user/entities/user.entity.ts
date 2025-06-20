import { Group } from "src/group/entities/group.entity";
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

    // @OneToMany(()=>Group)

  @OneToMany(() => Group, (group) => group.user)
  groups: Group[]



    // @ManyToMany(()=>Group,(group)=>group.users,{cascade:true})
    // @JoinTable()
    // groups:Group[];

  

}
