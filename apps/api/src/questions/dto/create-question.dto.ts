import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsArray, IsOptional, IsEnum, MinLength, MaxLength, ArrayMaxSize } from 'class-validator'
import { QuestionCategory } from '@prisma/client'

export class CreateQuestionDto {
  @ApiProperty({ minLength: 5, maxLength: 120 })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title: string

  @ApiProperty({ minLength: 20, maxLength: 5000 })
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  body: string

  @ApiProperty({ type: [String], maxItems: 5, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  tags?: string[]

  @ApiPropertyOptional({ enum: ['GENERAL', 'SYMPTOMS', 'MEDICATION', 'DIAGNOSIS', 'OTHER'], default: 'GENERAL' })
  @IsOptional()
  @IsEnum(QuestionCategory)
  category?: QuestionCategory
}
