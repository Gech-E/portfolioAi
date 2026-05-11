import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePortfolioDto) {
    return this.prisma.portfolio.create({
      data: {
        userId,
        slug: dto.slug,
        title: dto.title || dto.slug,
        description: dto.description,
        theme: dto.theme || {},
        customDomain: dto.customDomain,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { views: true },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
      include: {
        views: true,
      },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return portfolio;
  }

  async update(id: string, userId: string, dto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    const { template, ...data } = dto as any;

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        templateId: template || data.templateId,
      },
    });
  }

  async findBySlug(slug: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { 
        slug,
        status: 'PUBLISHED', // Only public if published
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            headline: true,
          },
        },
      },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return portfolio;
  }

  async publish(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    // Create a version snapshot before publishing
    await this.prisma.portfolioVersion.create({
      data: {
        portfolioId: id,
        version: portfolio.version,
        sections: portfolio.sections as any,
        theme: portfolio.theme as any,
        seoMeta: portfolio.seoMeta as any,
        changelog: `Published version ${portfolio.version}`,
      },
    });

    // Update portfolio status
    return this.prisma.portfolio.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishedUrl: `${portfolio.slug}.portfolioai.com`,
        version: { increment: 1 },
      },
    });
  }

  async getVersions(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return this.prisma.portfolioVersion.findMany({
      where: { portfolioId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async restoreVersion(id: string, versionId: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    const version = await this.prisma.portfolioVersion.findFirst({
      where: { id: versionId, portfolioId: id },
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        sections: version.sections as any,
        theme: version.theme as any,
        seoMeta: version.seoMeta as any,
      },
    });
  }

  async remove(id: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }
}
