// settle-up.entity.ts
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { User } from 'src/user/user.entity';
// import { Group } from 'src/group/group.entity';

@Entity()
export class SettleUp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  amount: number;

  @ManyToOne(() => User, (user) => user.paymentsMade)
  payer: User;

  @ManyToOne(() => User, (user) => user.paymentsReceived)
  payee: User;

  @ManyToOne(() => Group, (group) => group.settlements)
  group: Group;

//   @ManyToOne(() => User, user => user.paymentsMade)
//   payer: User;

//   @ManyToOne(() => User, user => user.paymentsReceived)
//   payee: User;

//   @ManyToOne(() => Group, group => group.settlements)
//   group: Group;
}

