import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsArray, IsOptional, IsEnum, MinLength, MaxLength, ArrayMaxSize } from 'class-validator'
import { QuestionStatus } from '@prisma/client'

export class UpdateQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  body?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  tags?: string[]

  @ApiPropertyOptional({ enum: ['OPEN', 'CLOSED'] })
  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus
}
