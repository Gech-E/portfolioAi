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
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from '../ai/ai.service';
import { Request, Response } from 'express';

@ApiTags('Resumes')
@ApiBearerAuth()
@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resume' })
  async create(@Req() req: Request, @Body() createResumeDto: CreateResumeDto) {
    const user = (req as any).user;
    const resume = await this.resumesService.create(user.sub, createResumeDto);
    return { success: true, data: resume, timestamp: new Date().toISOString() };
  }

  @Get()
  @ApiOperation({ summary: 'List all resumes' })
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    const resumes = await this.resumesService.findAllForUser(user.sub);
    return { success: true, data: resumes, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resume by ID' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const resume = await this.resumesService.findOne(id, user.sub);
    return { success: true, data: resume, timestamp: new Date().toISOString() };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a resume' })
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
  @ApiOperation({ summary: 'Delete a resume' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    await this.resumesService.remove(id, user.sub);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize resume for a target job' })
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

  @Get(':id/score')
  @ApiOperation({ summary: 'Get ATS score for a resume' })
  async getAtsScore(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const score = await this.resumesService.getAtsScore(id, user.sub);
    return { success: true, data: score, timestamp: new Date().toISOString() };
  }

  @Get(':id/export/pdf')
  @ApiOperation({ summary: 'Export resume as PDF (HTML)' })
  async exportPdf(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = (req as any).user;
    const { html, title } = await this.resumesService.exportPdf(id, user.sub);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.html"`);
    res.send(html);
  }

  @Post(':id/sections')
  @ApiOperation({ summary: 'Add a section to a resume' })
  async addSection(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { type: string; title: string; content?: any },
  ) {
    const user = (req as any).user;
    const section = await this.resumesService.addSection(id, user.sub, body);
    return { success: true, data: section, timestamp: new Date().toISOString() };
  }

  @Delete(':id/sections/:sectionId')
  @ApiOperation({ summary: 'Remove a section from a resume' })
  async removeSection(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ) {
    const user = (req as any).user;
    const updated = await this.resumesService.removeSection(id, user.sub, sectionId);
    return { success: true, data: updated, timestamp: new Date().toISOString() };
  }
}
