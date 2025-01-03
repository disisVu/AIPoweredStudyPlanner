import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.example.com', // SMTP host
                port: 587,               // SMTP port
                auth: {
                    user: 'your-email@example.com', // SMTP email
                    pass: 'your-email-password',    // SMTP password
                },
            },
            defaults: {
                from: '"No Reply" <no-reply@example.com>', // Default "from" email address
            },
        }),
    ],
})
export class MailerConfigModule { }
