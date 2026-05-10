import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { IntegrationProvider } from '@portfolioai/database';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    const integrations = await this.integrationsService.findAllForUser(user.sub);
    return { success: true, data: integrations, timestamp: new Date().toISOString() };
  }

  @Post(':provider/sync')
  async sync(@Req() req: Request, @Param('provider') provider: string) {
    const user = (req as any).user;
    if (provider.toUpperCase() === 'GITHUB') {
      const data = await this.integrationsService.syncGitHub(user.sub);
      return { success: true, data, timestamp: new Date().toISOString() };
    }
    return { success: false, message: 'Provider sync not supported yet' };
  }

  @Delete(':provider')
  async disconnect(@Req() req: Request, @Param('provider') provider: string) {
    const user = (req as any).user;
    await this.integrationsService.disconnect(user.sub, provider.toUpperCase() as IntegrationProvider);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }
}
