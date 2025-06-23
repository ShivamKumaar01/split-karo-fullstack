// import { Injectable } from '@nestjs/common';
// // import { CreateMailDto } from './dto/create-mail.dto';
// // import { UpdateMailDto } from './dto/update-mail.dto';

// @Injectable()
// export class MailService {
 
// }

// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({
    to,
    subject,
    template,
    context,
  }: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}

