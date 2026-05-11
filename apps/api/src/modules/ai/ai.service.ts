import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly aiServiceUrl: string;

  constructor(private readonly prisma: PrismaService) {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  async generate(userId: string, type: string, input: any) {
    // 1. Check AI credits
    const creditRecord = await this.prisma.aICredits.findUnique({
      where: { userId },
    });

    if (!creditRecord) {
      throw new BadRequestException('Credit record not found');
    }

    if (creditRecord.used >= creditRecord.total) {
      throw new BadRequestException('Insufficient AI credits');
    }

    // 2. Call FastAPI service
    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, input }),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const result = await response.json();

      // 3. Deduct credit
      await this.prisma.aICredits.update({
        where: { userId },
        data: { used: { increment: 1 } },
      });

      // 4. Record generation
      const generation = await this.prisma.aIGeneration.create({
        data: {
          userId,
          type: type as any,
          input: input as any,
          output: result.result,
          tokensUsed: result.tokens_used || 0,
          model: result.model || 'gpt-4o-mini',
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      return {
        ...result,
        generationId: generation.id,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`AI generation failed: ${error.message}`);
    }
  }

  async getCredits(userId: string) {
    return this.prisma.aICredits.findUnique({
      where: { userId },
    });
  }

  async getUsage(userId: string) {
    const credits = await this.prisma.aICredits.findUnique({
      where: { userId },
    });

    const totalGenerations = await this.prisma.aIGeneration.count({
      where: { userId },
    });

    const thisMonthGenerations = await this.prisma.aIGeneration.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      credits: {
        total: credits?.total || 0,
        used: credits?.used || 0,
        remaining: (credits?.total || 0) - (credits?.used || 0),
        resetsAt: credits?.resetsAt || null,
      },
      stats: {
        totalGenerations,
        thisMonthGenerations,
      },
    };
  }

  async getHistory(userId: string, limit = 20) {
    return this.prisma.aIGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        model: true,
        tokensUsed: true,
        output: true,
        createdAt: true,
        completedAt: true,
      },
    });
  }

  async submitFeedback(userId: string, generationId: string, rating: string, note?: string) {
    const generation = await this.prisma.aIGeneration.findFirst({
      where: { id: generationId, userId },
    });

    if (!generation) {
      throw new NotFoundException('Generation not found');
    }

    // Store feedback in the generation record's input field (extending it)
    const currentInput = (generation.input as any) || {};
    return this.prisma.aIGeneration.update({
      where: { id: generationId },
      data: {
        input: {
          ...currentInput,
          _feedback: { rating, note, submittedAt: new Date().toISOString() },
        } as any,
      },
    });
  }
}
