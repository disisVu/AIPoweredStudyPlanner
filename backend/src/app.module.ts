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

@Module({
  imports: [
    // Loads .env & configuration.ts
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // Connects to MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI),
    // Additional modules
    AuthModule,
    TasksModule,
    EventsModule,
    FocusTimersModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
