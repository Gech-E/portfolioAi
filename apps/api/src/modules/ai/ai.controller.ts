import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Proxy')
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
}
