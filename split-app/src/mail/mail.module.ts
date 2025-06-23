// import { Module } from '@nestjs/common';
// import { MailService } from './mail.service';
// import { MailController } from './mail.controller';

// @Module({
//   controllers: [MailController],
//   providers: [MailService],
// })
// export class MailModule {}


import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'shivamkumaar01@gmail.com',     
          pass: 'nnam lhlk dnpo ppxv',       
        },
      },
      defaults: {
        from: '"Split Karo "shivamkumaar01@gmail.com',
      },
      template: {
        // dir: join(__dirname, 'templates'),
        dir: join(process.cwd(), 'src', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}

