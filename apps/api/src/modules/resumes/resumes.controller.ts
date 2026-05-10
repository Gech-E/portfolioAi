import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from '../ai/ai.service';
import { Request } from 'express';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() createResumeDto: CreateResumeDto) {
    const user = (req as any).user;
    const resume = await this.resumesService.create(user.sub, createResumeDto);
    return { success: true, data: resume, timestamp: new Date().toISOString() };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    const resumes = await this.resumesService.findAllForUser(user.sub);
    return { success: true, data: resumes, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const resume = await this.resumesService.findOne(id, user.sub);
    return { success: true, data: resume, timestamp: new Date().toISOString() };
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    const user = (req as any).user;
    const updated = await this.resumesService.update(id, user.sub, updateResumeDto);
    return { success: true, data: updated, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    await this.resumesService.remove(id, user.sub);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }

  @Post(':id/optimize')
  async optimize(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { jobDescription: string },
  ) {
    const user = (req as any).user;
    const resume = await this.resumesService.findOne(id, user.sub);
    
    const result = await this.aiService.generate(user.sub, 'RESUME_OPTIMIZE', {
      resume: resume.sections,
      jobDescription: body.jobDescription,
    });

    return { success: true, data: result, timestamp: new Date().toISOString() };
  }
}
