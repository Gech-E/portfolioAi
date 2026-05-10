import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'my-awesome-portfolio' })
  @IsString()
  @MinLength(3)
  slug!: string;

  @ApiPropertyOptional({ example: 'My Awesome Portfolio' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'A portfolio of my best work.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'minimal' })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiPropertyOptional()
  @IsOptional()
  theme?: any; // Ideally an object structure

  @ApiPropertyOptional({ example: 'www.myawesomeportfolio.com' })
  @IsOptional()
  @IsString()
  customDomain?: string;
}
