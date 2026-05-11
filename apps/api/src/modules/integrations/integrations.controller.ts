import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { IntegrationProvider } from '@portfolioai/database';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all integrations' })
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    const integrations = await this.integrationsService.findAllForUser(user.sub);
    return { success: true, data: integrations, timestamp: new Date().toISOString() };
  }

  @Post(':provider/connect')
  @ApiOperation({ summary: 'Connect an integration' })
  async connect(
    @Req() req: Request,
    @Param('provider') provider: string,
    @Body() body: { accessToken?: string; username?: string; profileUrl?: string },
  ) {
    const user = (req as any).user;
    const providerEnum = provider.toUpperCase() as IntegrationProvider;

    // Simulate OAuth by accepting token data directly
    const integration = await this.integrationsService.connect(user.sub, providerEnum, {
      accessToken: body.accessToken || `mock_token_${Date.now()}`,
      refreshToken: null,
      username: body.username || `user_${provider.toLowerCase()}`,
      profileUrl: body.profileUrl || `https://${provider.toLowerCase()}.com/user`,
    });

    return { success: true, data: integration, timestamp: new Date().toISOString() };
  }

  @Post(':provider/sync')
  @ApiOperation({ summary: 'Sync data from an integration' })
  async sync(@Req() req: Request, @Param('provider') provider: string) {
    const user = (req as any).user;
    if (provider.toUpperCase() === 'GITHUB') {
      const data = await this.integrationsService.syncGitHub(user.sub);
      return { success: true, data, timestamp: new Date().toISOString() };
    }
    return { success: false, message: 'Provider sync not supported yet' };
  }

  @Delete(':provider')
  @ApiOperation({ summary: 'Disconnect an integration' })
  async disconnect(@Req() req: Request, @Param('provider') provider: string) {
    const user = (req as any).user;
    await this.integrationsService.disconnect(user.sub, provider.toUpperCase() as IntegrationProvider);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }
}
