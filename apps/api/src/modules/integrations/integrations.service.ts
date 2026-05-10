import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationProvider, IntegrationStatus } from '@portfolioai/database';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.integration.findMany({
      where: { userId },
    });
  }

  async connect(userId: string, provider: IntegrationProvider, data: any) {
    return this.prisma.integration.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        externalUsername: data.username,
        profileUrl: data.profileUrl,
        lastSyncAt: new Date(),
      },
      create: {
        userId,
        provider,
        status: IntegrationStatus.CONNECTED,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        externalUsername: data.username,
        profileUrl: data.profileUrl,
        lastSyncAt: new Date(),
      },
    });
  }

  async disconnect(userId: string, provider: IntegrationProvider) {
    const integration = await this.prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.integration.update({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      data: {
        status: IntegrationStatus.DISCONNECTED,
        accessToken: null,
        refreshToken: null,
      },
    });
  }

  async syncGitHub(userId: string) {
    const integration = await this.prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: IntegrationProvider.GITHUB,
        },
      },
    });

    if (!integration || !integration.accessToken) {
      throw new Error('GitHub not connected');
    }

    // Mock fetch from GitHub
    const mockRepos = [
      { name: 'portfolio-ai', description: 'AI-powered portfolio builder', language: 'TypeScript', stars: 120 },
      { name: 'awesome-nest', description: 'Curated list of NestJS resources', language: 'None', stars: 450 },
    ];

    await this.prisma.integration.update({
      where: { id: integration.id },
      data: {
        data: { repos: mockRepos } as any,
        lastSyncAt: new Date(),
        status: IntegrationStatus.CONNECTED,
      },
    });

    return mockRepos;
  }
}
