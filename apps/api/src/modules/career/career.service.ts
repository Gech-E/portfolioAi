import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoadmap(userId: string, data: any) {
    return this.prisma.careerRoadmap.create({
      data: {
        userId,
        currentRole: data.currentRole,
        targetRole: data.targetRole,
        timelineMonths: data.timelineMonths || 6,
        milestones: data.milestones || [],
      },
    });
  }

  async getRoadmaps(userId: string) {
    return this.prisma.careerRoadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAssessment(userId: string, data: any) {
    return this.prisma.skillAssessment.create({
      data: {
        userId,
        skills: data.skills || [],
        employabilityScore: data.employabilityScore || 0,
        targetRole: data.targetRole,
        gaps: data.gaps || [],
        recommendations: data.recommendations || [],
      },
    });
  }

  async getAssessments(userId: string) {
    return this.prisma.skillAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
