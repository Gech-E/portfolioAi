import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateRoadmapDto {
  @ApiProperty({ example: 'Junior Frontend Developer' })
  @IsString()
  @IsNotEmpty()
  currentRole: string;

  @ApiProperty({ example: 'Senior Full Stack Engineer' })
  @IsString()
  @IsNotEmpty()
  targetRole: string;

  @ApiPropertyOptional({ example: 6, description: 'Timeline in months' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(60)
  timelineMonths?: number;
}
