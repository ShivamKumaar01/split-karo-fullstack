import { Group } from "src/group/entities/group.entity";
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn()
    id: number


    @ManyToOne(() => User, user => user.groupMembers)
    user: User;


    @ManyToOne(()=>Group,(group)=>group.groupmembers)
    group:Group

    @CreateDateColumn()
    joinedAt: Date


}
