import { Module } from '@nestjs/common';
import { PortfoliosController } from './portfolios.controller';
import { PublicPortfoliosController } from './public-portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  controllers: [PortfoliosController, PublicPortfoliosController],
  providers: [PortfoliosService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
