import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CareerService } from './career.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from '../ai/ai.service';

@Controller('career')
@UseGuards(JwtAuthGuard)
export class CareerController {
  constructor(
    private readonly careerService: CareerService,
    private readonly aiService: AiService,
  ) {}

  @Get('roadmaps')
  getRoadmaps(@Request() req) {
    return this.careerService.getRoadmaps(req.user.id);
  }

  @Post('roadmaps/generate')
  async generateRoadmap(
    @Request() req,
    @Body() body: { currentRole: string; targetRole: string; timelineMonths?: number },
  ) {
    const result = await this.aiService.generate(req.user.id, 'CAREER_ROADMAP', body);
    
    // Save to database
    const roadmap = await this.careerService.createRoadmap(req.user.id, {
      ...body,
      milestones: result.result.milestones,
    });

    return roadmap;
  }

  @Get('assessments')
  getAssessments(@Request() req) {
    return this.careerService.getAssessments(req.user.id);
  }

  @Post('assessments/generate')
  async generateAssessment(
    @Request() req,
    @Body() body: { targetRole: string },
  ) {
    // Get user context (skills from profile/integrations)
    const user = await this.aiService.getCredits(req.user.id); // Placeholder for user context
    
    const result = await this.aiService.generate(req.user.id, 'SKILL_ANALYSIS', {
      targetRole: body.targetRole,
      // In a real app, we'd pass user's actual skills here
    });

    const assessment = await this.careerService.createAssessment(req.user.id, {
      ...result.result,
      targetRole: body.targetRole,
    });

    return assessment;
  }
}
