import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticGuard } from './analytics.guard';

@Controller('analytics')
@UseGuards(AnalyticGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total-time/:userId')
  async getTotalTime(@Param('userId') userId: string) {
    return this.analyticsService.getTotalTime(userId);
  }

  @Get('daily-time/:userId')
  async getDailyTime(@Param('userId') userId: string) {
    return this.analyticsService.getDailyTime(userId);
  }

  @Get('task-status/:userId')
  async getTaskStatus(@Param('userId') userId: string) {
    return this.analyticsService.getTaskStatus(userId);
  }
}
