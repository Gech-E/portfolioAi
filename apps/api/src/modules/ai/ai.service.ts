import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
          tokensUsed: result.tokens_used,
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
}
