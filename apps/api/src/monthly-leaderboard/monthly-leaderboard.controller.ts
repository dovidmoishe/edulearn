import { Controller, Get, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply } from 'fastify';
import { MonthlyLeaderboardService } from './monthly-leaderboard.service';

@Controller('monthly-leaderboard')
export class MonthlyLeaderboardController {
  constructor(
    private readonly monthlyLeaderboardService: MonthlyLeaderboardService,
  ) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get('preview')
  async preview(
    @Query('year') yearStr: string,
    @Query('month') monthStr: string,
    @Query('mock') mockStr: string,
    @Query('theme') theme: 'light' | 'dark',
    @Res({ passthrough: false }) res: FastifyReply,
  ) {
    const now = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;
    const mock = mockStr === '1' || mockStr === 'true';

    const png = await this.monthlyLeaderboardService.buildPreviewPng({
      year,
      month,
      theme,
      mock,
    });
    res.header('Content-Type', 'image/png');
    res.header('Cache-Control', 'no-store');
    res.send(png);
  }
}
