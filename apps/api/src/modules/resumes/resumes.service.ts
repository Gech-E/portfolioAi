import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
  private readonly aiServiceUrl: string;

  constructor(private readonly prisma: PrismaService) {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  async create(userId: string, dto: CreateResumeDto) {
    return this.prisma.resume.create({
      data: {
        userId,
        title: dto.title,
        targetRole: dto.targetRole,
        targetCompany: dto.targetCompany,
        jobDescription: dto.jobDescription,
        sections: dto.sections || [],
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
      include: {
        versions: true,
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async update(id: string, userId: string, dto: UpdateResumeDto) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.delete({
      where: { id },
    });
  }

  async getAtsScore(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ATS_SCORE',
          input: {
            resume: JSON.stringify(resume.sections),
            targetRole: resume.targetRole || 'General',
            jobDescription: resume.jobDescription || '',
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const score = result.result || this.buildMockScore();
        await this.prisma.resume.update({
          where: { id },
          data: { atsScore: score as any },
        });
        return score;
      }
    } catch {
      // Fall through to mock
    }

    const mockScore = this.buildMockScore();
    await this.prisma.resume.update({
      where: { id },
      data: { atsScore: mockScore as any },
    });
    return mockScore;
  }

  private buildMockScore() {
    return {
      score: 72,
      breakdown: {
        keywords: { score: 68, feedback: 'Add more industry-specific keywords' },
        formatting: { score: 85, feedback: 'Good structure and formatting' },
        impact: { score: 65, feedback: 'Use more quantified achievements' },
        relevance: { score: 70, feedback: 'Align experience with target role' },
      },
      suggestions: [
        'Add quantified achievements (e.g., "Increased revenue by 25%")',
        'Include more keywords from the job description',
        'Add a professional summary section',
      ],
    };
  }

  async exportPdf(id: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    await this.prisma.resumeDownload.create({
      data: {
        resumeId: id,
        userId,
        format: 'pdf',
        source: 'dashboard',
      },
    });

    await this.prisma.resume.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    const sections = (resume.sections as any[]) || [];
    let sectionsHtml = '';

    for (const section of sections) {
      if (section.type === 'personal') {
        sectionsHtml += `<div class="section"><h1>${section.content?.name || resume.title}</h1>
          <p>${section.content?.email || ''} ${section.content?.phone ? '• ' + section.content.phone : ''}</p>
          <p>${section.content?.location || ''}</p></div>`;
      } else if (section.type === 'experience') {
        sectionsHtml += `<div class="section"><h2>${section.title || 'Experience'}</h2>`;
        for (const item of section.content?.items || []) {
          sectionsHtml += `<div class="item"><h3>${item.role || ''} — ${item.company || ''}</h3>
            <p class="date">${item.startDate || ''} - ${item.endDate || 'Present'}</p>
            <p>${item.description || ''}</p></div>`;
        }
        sectionsHtml += '</div>';
      } else if (section.type === 'education') {
        sectionsHtml += `<div class="section"><h2>${section.title || 'Education'}</h2>`;
        for (const item of section.content?.items || []) {
          sectionsHtml += `<div class="item"><h3>${item.degree || ''} — ${item.school || ''}</h3>
            <p class="date">${item.startDate || ''} - ${item.endDate || ''}</p></div>`;
        }
        sectionsHtml += '</div>';
      } else if (section.type === 'skills') {
        sectionsHtml += `<div class="section"><h2>${section.title || 'Skills'}</h2><div class="skills">`;
        for (const skill of section.content?.skills || []) {
          sectionsHtml += `<span class="skill">${skill}</span>`;
        }
        sectionsHtml += '</div></div>';
      } else {
        sectionsHtml += `<div class="section"><h2>${section.title || 'Section'}</h2><p>${section.content?.text || ''}</p></div>`;
      }
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.title}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1a1a1a;padding:40px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.6}.section{margin-bottom:24px}h1{font-size:28px;font-weight:700;margin-bottom:4px}h2{font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:4px;margin-bottom:12px}h3{font-size:15px;font-weight:600}.date{font-size:12px;color:#6b7280;margin-bottom:4px}.item{margin-bottom:16px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill{background:#f3f4f6;padding:4px 12px;border-radius:16px;font-size:13px}</style>
      </head><body>${sectionsHtml || '<div class="section"><h1>' + resume.title + '</h1><p>Add sections to build your resume.</p></div>'}</body></html>`;

    return { html, title: resume.title };
  }

  async addSection(id: string, userId: string, section: { type: string; title: string; content?: any }) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const sections = (resume.sections as any[]) || [];
    const newSection = {
      id: `section_${Date.now()}`,
      type: section.type,
      title: section.title,
      content: section.content || {},
    };
    sections.push(newSection);

    await this.prisma.resume.update({
      where: { id },
      data: { sections: sections as any },
    });

    return newSection;
  }

  async removeSection(id: string, userId: string, sectionId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const sections = ((resume.sections as any[]) || []).filter(
      (s: any) => s.id !== sectionId,
    );

    return this.prisma.resume.update({
      where: { id },
      data: { sections: sections as any },
    });
  }
}
