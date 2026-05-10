import { Controller, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    const profile = await this.usersService.findById(user.sub);
    return { success: true, data: profile, timestamp: new Date().toISOString() };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@Req() req: Request, @Body() body: any) {
    const user = (req as any).user;
    const updated = await this.usersService.updateProfile(user.sub, body);
    return { success: true, data: updated, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async getById(@Param('id') id: string) {
    const profile = await this.usersService.findById(id);
    return { success: true, data: profile, timestamp: new Date().toISOString() };
  }
}
