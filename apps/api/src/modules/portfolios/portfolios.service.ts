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

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        ...dto,
        template: undefined, // remove template from dto
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
