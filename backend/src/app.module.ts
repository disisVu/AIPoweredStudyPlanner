import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@/config/configuration';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { TasksModule } from '@/tasks/tasks.module';
import { EventsModule } from '@/events/events.module';
import { FocusTimersModule } from '@/focus-timers/focus-timers.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytic/analytics.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    // Loads .env & configuration.ts
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // Connects to MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI),
    // Additional modules
    AuthModule,
    TasksModule,
    EventsModule,
    FocusTimersModule,
    UsersModule,
    AnalyticsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir:
          process.env.NODE_ENV === 'production'
            ? __dirname + '/src/templates'
            : __dirname + '/../src/templates',
        adapter: new HandlebarsAdapter(), // Use Handlebars for templates
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
