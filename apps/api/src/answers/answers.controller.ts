import { Controller, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AnswersService } from './answers.service'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { UpdateAnswerDto } from './dto/update-answer.dto'
import { RequestUserGuard } from '../common/guards/request-user.guard'

@ApiTags('answers')
@Controller()
export class AnswersController {
  constructor(private answersService: AnswersService) {}

  @Post('questions/:questionId/answers')
  @UseGuards(RequestUserGuard)
  async create(
    @Param('questionId') questionId: string,
    @Body() dto: CreateAnswerDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.answersService.create(questionId, req.user.id, dto)
  }

  @Patch('answers/:id')
  @UseGuards(RequestUserGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnswerDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.answersService.update(id, req.user.id, dto)
  }

  @Delete('answers/:id')
  @UseGuards(RequestUserGuard)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    await this.answersService.remove(id, req.user.id)
  }

  @Post('answers/:id/vote')
  @UseGuards(RequestUserGuard)
  async vote(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.answersService.vote(id, req.user.id)
  }

  @Delete('answers/:id/vote')
  @UseGuards(RequestUserGuard)
  async unvote(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.answersService.unvote(id, req.user.id)
  }
}
