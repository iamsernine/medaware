import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength } from 'class-validator'

export class CreateAnswerDto {
  @ApiProperty({ minLength: 20, maxLength: 5000 })
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  body: string
}
