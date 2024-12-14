import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '@/config/configuration';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { TasksModule } from '@/tasks/tasks.module';
import { EventsModule } from '@/events/events.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
