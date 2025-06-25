import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ExpenseModule } from './expense/expense.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { SplitModule } from './split/split.module';
import { SettleUpModule } from './settle-up/settle-up.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  
    imports: [
   
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    AuthModule,
    GroupModule,
    ExpenseModule,
    GroupMemberModule,
    SplitModule,
    SettleUpModule,
    MailModule,
    CloudinaryModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
