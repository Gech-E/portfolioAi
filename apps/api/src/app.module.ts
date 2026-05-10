import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { AiModule } from './modules/ai/ai.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { CareerModule } from './modules/career/career.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    PortfoliosModule,
    AiModule,
    ResumesModule,
    CareerModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
