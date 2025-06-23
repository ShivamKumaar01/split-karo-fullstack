import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Split } from 'src/split/entities/split.entity';
import { SettleUp } from 'src/settle-up/entities/settle-up.entity';
dotenv.config();


// const isCompiled = __filename.endsWith('.js');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'split-karo',
  synchronize: true,
  logging:true,
  entities: [User,Group,GroupMember,Expense,Split,SettleUp],
  // migrations: [isCompiled ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],

});