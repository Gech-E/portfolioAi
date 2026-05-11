import { Controller, Post, Body, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI content' })
  async generate(@Req() req: Request, @Body() body: { type: string; input: any }) {
    const user = (req as any).user;
    const result = await this.aiService.generate(user.sub, body.type, body.input);
    return { success: true, data: result, timestamp: new Date().toISOString() };
  }

  @Get('credits')
  @ApiOperation({ summary: 'Get current AI credits' })
  async getCredits(@Req() req: Request) {
    const user = (req as any).user;
    const credits = await this.aiService.getCredits(user.sub);
    return { success: true, data: credits, timestamp: new Date().toISOString() };
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI usage statistics' })
  async getUsage(@Req() req: Request) {
    const user = (req as any).user;
    const usage = await this.aiService.getUsage(user.sub);
    return { success: true, data: usage, timestamp: new Date().toISOString() };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get AI generation history' })
  async getHistory(@Req() req: Request, @Query('limit') limit?: number) {
    const user = (req as any).user;
    const history = await this.aiService.getHistory(user.sub, limit || 20);
    return { success: true, data: history, timestamp: new Date().toISOString() };
  }

  @Post('generations/:id/feedback')
  @ApiOperation({ summary: 'Submit feedback on a generation' })
  async submitFeedback(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { rating: string; note?: string },
  ) {
    const user = (req as any).user;
    await this.aiService.submitFeedback(user.sub, id, body.rating, body.note);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }
}
