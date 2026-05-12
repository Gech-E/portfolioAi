import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateAssessmentDto {
  @ApiProperty({ example: 'Senior Full Stack Engineer' })
  @IsString()
  @IsNotEmpty()
  targetRole!: string;
}
