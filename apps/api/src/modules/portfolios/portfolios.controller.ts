import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Portfolios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  async create(@Req() req: Request, @Body() dto: CreatePortfolioDto) {
    const user = (req as any).user;
    const portfolio = await this.portfoliosService.create(user.sub, dto);
    return { success: true, data: portfolio, timestamp: new Date().toISOString() };
  }

  @Get()
  @ApiOperation({ summary: 'Get all portfolios for current user' })
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    const portfolios = await this.portfoliosService.findAllForUser(user.sub);
    return { success: true, data: portfolios, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get portfolio by ID' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const portfolio = await this.portfoliosService.findOne(id, user.sub);
    return { success: true, data: portfolio, timestamp: new Date().toISOString() };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a portfolio' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePortfolioDto) {
    const user = (req as any).user;
    const updated = await this.portfoliosService.update(id, user.sub, dto);
    return { success: true, data: updated, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    await this.portfoliosService.remove(id, user.sub);
    return { success: true, data: null, timestamp: new Date().toISOString() };
  }
}
