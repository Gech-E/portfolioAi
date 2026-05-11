import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CareerService } from './career.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from '../ai/ai.service';
import { Request } from 'express';
import { GenerateRoadmapDto } from './dto/generate-roadmap.dto';
import { GenerateAssessmentDto } from './dto/generate-assessment.dto';

@Controller('career')
@UseGuards(JwtAuthGuard)
export class CareerController {
  constructor(
    private readonly careerService: CareerService,
    private readonly aiService: AiService,
  ) {}

  @Get('roadmaps')
  async getRoadmaps(@Req() req: Request) {
    const user = (req as any).user;
    const roadmaps = await this.careerService.getRoadmaps(user.sub);
    return { success: true, data: roadmaps, timestamp: new Date().toISOString() };
  }

  @Post('roadmaps/generate')
  async generateRoadmap(
    @Req() req: Request,
    @Body() body: GenerateRoadmapDto,
  ) {
    const user = (req as any).user;
    const result = await this.aiService.generate(user.sub, 'CAREER_ROADMAP', body);
    
    // Save to database
    const roadmap = await this.careerService.createRoadmap(user.sub, {
      ...body,
      milestones: result.result.milestones,
    });

    return { success: true, data: roadmap, timestamp: new Date().toISOString() };
  }

  @Get('assessments')
  async getAssessments(@Req() req: Request) {
    const user = (req as any).user;
    const assessments = await this.careerService.getAssessments(user.sub);
    return { success: true, data: assessments, timestamp: new Date().toISOString() };
  }

  @Post('assessments/generate')
  async generateAssessment(
    @Req() req: Request,
    @Body() body: GenerateAssessmentDto,
  ) {
    const user = (req as any).user;
    
    const result = await this.aiService.generate(user.sub, 'SKILL_ANALYSIS', {
      targetRole: body.targetRole,
      context: 'Based on user profile data', // In a real app, fetch actual profile data
    });

    const assessment = await this.careerService.createAssessment(user.sub, {
      ...result.result,
      targetRole: body.targetRole,
    });

    return { success: true, data: assessment, timestamp: new Date().toISOString() };
  }
}
