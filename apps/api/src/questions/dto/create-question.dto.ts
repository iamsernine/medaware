import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray, IsOptional, MinLength, MaxLength, ArrayMaxSize } from 'class-validator'

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
}
