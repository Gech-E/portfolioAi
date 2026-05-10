import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from '../ai/ai.service';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  create(@Request() req, @Body() createResumeDto: CreateResumeDto) {
    return this.resumesService.create(req.user.id, createResumeDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.resumesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.resumesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, req.user.id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.resumesService.remove(id, req.user.id);
  }

  @Post(':id/optimize')
  async optimize(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { jobDescription: string },
  ) {
    const resume = await this.resumesService.findOne(id, req.user.id);
    
    const result = await this.aiService.generate(req.user.id, 'RESUME_OPTIMIZE', {
      resume: resume.sections,
      jobDescription: body.jobDescription,
    });

    return result;
  }
}
