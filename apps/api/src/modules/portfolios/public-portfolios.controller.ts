import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Public Portfolios')
@Controller('p')
export class PublicPortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get a public portfolio by slug' })
  async findBySlug(@Param('slug') slug: string) {
    const portfolio = await this.portfoliosService.findBySlug(slug);
    return { success: true, data: portfolio, timestamp: new Date().toISOString() };
  }
}
