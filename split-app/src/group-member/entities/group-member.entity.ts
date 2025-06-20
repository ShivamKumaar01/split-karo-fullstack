import { Group } from "src/group/entities/group.entity";
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>User)
    @JoinColumn()
    user_id:User

    @ManyToOne(()=>Group)
    @JoinColumn()
    group_id:Group


    @CreateDateColumn()
    joinedAt:Date


}
