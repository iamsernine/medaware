import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Req, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { RequestUserGuard } from '../common/guards/request-user.guard'

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('author_id') author_id?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Headers('x-user-id') xUserId?: string,
  ) {
    const result = await this.questionsService.findAll({
      search,
      tag,
      author_id,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sort: sort === 'votes' ? 'votes' : 'newest',
      userId: xUserId ?? undefined,
    })
    return result
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('x-user-id') xUserId?: string) {
    return this.questionsService.findOne(id, xUserId ?? undefined)
  }

  @Post()
  @UseGuards(RequestUserGuard)
  async create(@Body() dto: CreateQuestionDto, @Req() req: { user: { id: string } }) {
    return this.questionsService.create(req.user.id, dto)
  }

  @Patch(':id')
  @UseGuards(RequestUserGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto, @Req() req: { user: { id: string } }) {
    return this.questionsService.update(id, req.user.id, dto)
  }

  @Delete(':id')
  @UseGuards(RequestUserGuard)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    await this.questionsService.remove(id, req.user.id)
  }

  @Post(':id/vote')
  @UseGuards(RequestUserGuard)
  async vote(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.questionsService.vote(id, req.user.id)
  }

  @Delete(':id/vote')
  @UseGuards(RequestUserGuard)
  async unvote(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.questionsService.unvote(id, req.user.id)
  }
}
