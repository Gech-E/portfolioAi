import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics overview for current user' })
  async getOverview(@Req() req: Request) {
    const user = (req as any).user;
    const overview = await this.analyticsService.getOverview(user.sub);
    return { success: true, data: overview, timestamp: new Date().toISOString() };
  }

  @Get('portfolio/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for a specific portfolio' })
  async getPortfolioAnalytics(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const analytics = await this.analyticsService.getPortfolioAnalytics(id, user.sub);
    return { success: true, data: analytics, timestamp: new Date().toISOString() };
  }

  @Post('track')
  @ApiOperation({ summary: 'Track a portfolio view (public, no auth)' })
  async trackView(@Body() body: {
    portfolioId: string;
    visitorId?: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
  }) {
    const result = await this.analyticsService.trackView(body.portfolioId, body);
    return { success: true, data: result, timestamp: new Date().toISOString() };
  }
}
