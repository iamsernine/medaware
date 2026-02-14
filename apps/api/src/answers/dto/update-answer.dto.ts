import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

export class UpdateAnswerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  body?: string
}
