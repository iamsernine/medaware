import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'

interface ListParams {
  search?: string
  tag?: string
  author_id?: string
  page?: number
  limit?: number
  sort?: 'newest' | 'votes'
  userId?: string
}

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: ListParams) {
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.min(100, Math.max(1, params.limit ?? 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' as const } },
        { body: { contains: params.search, mode: 'insensitive' as const } },
      ]
    }
    if (params.tag) where.tags = { has: params.tag }
    if (params.author_id) where.author_id = params.author_id

    const orderBy =
      params.sort === 'votes'
        ? { questionVotes: { _count: 'desc' as const } }
        : { created_at: 'desc' as const }

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include: {
          author: true,
          _count: { select: { questionVotes: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.question.count({ where }),
    ])

    const questionIds = questions.map((q) => q.id)
    const votedQuestionIds =
      params.userId && questionIds.length > 0
        ? await this.prisma.questionVote
            .findMany({ where: { user_id: params.userId, question_id: { in: questionIds } }, select: { question_id: true } })
            .then((rows) => new Set(rows.map((r) => r.question_id)))
        : new Set<string>()
    const data = questions.map((q) => ({
      ...q,
      voteCount: (q as any)._count?.questionVotes ?? 0,
      hasVoted: votedQuestionIds.has(q.id),
      _count: undefined,
    }))
    return { data, meta: { page, limit, total } }
  }

  async findOne(id: string, userId?: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: true,
        _count: { select: { questionVotes: true } },
        answers: {
          include: {
            doctor: true,
            _count: { select: { answerVotes: true } },
          },
          orderBy: { created_at: 'asc' as const },
        },
      },
    })
    if (!question) throw new NotFoundException('Question not found')
    const voteCount = (question as any)._count?.questionVotes ?? 0
    const hasVoted =
      userId != null
        ? await this.prisma.questionVote.findFirst({ where: { user_id: userId, question_id: id } }).then(Boolean)
        : false
    const answerIds = (question.answers || []).map((a: any) => a.id)
    const votedAnswerIds =
      userId && answerIds.length > 0
        ? await this.prisma.answerVote
            .findMany({ where: { user_id: userId, answer_id: { in: answerIds } }, select: { answer_id: true } })
            .then((rows) => new Set(rows.map((r) => r.answer_id)))
        : new Set<string>()
    const answers = (question.answers || []).map((a: any) => ({
      ...a,
      voteCount: a._count?.answerVotes ?? 0,
      hasVoted: votedAnswerIds.has(a.id),
      _count: undefined,
    }))
    return {
      data: {
        ...question,
        answers,
        voteCount,
        hasVoted,
        _count: undefined,
      },
    }
  }

  async create(authorId: string, dto: CreateQuestionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: authorId } })
    if (!user || user.role !== 'PATIENT') throw new ForbiddenException('Only patients can create questions')
    const q = await this.prisma.question.create({
      data: { author_id: authorId, title: dto.title, body: dto.body, tags: dto.tags ?? [] },
      include: { author: true },
    })
    return { data: q }
  }

  async update(id: string, userId: string, dto: UpdateQuestionDto) {
    const q = await this.prisma.question.findUnique({ where: { id } })
    if (!q) throw new NotFoundException('Question not found')
    const isAuthor = q.author_id === userId
    const hasContentUpdate = dto.title !== undefined || dto.body !== undefined || dto.tags !== undefined
    if (hasContentUpdate && !isAuthor) throw new ForbiddenException('Only the author can update this question')
    if (dto.status === 'CLOSED') {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user || user.role !== 'DOCTOR' || !user.is_verified_doctor) {
        throw new ForbiddenException('Only verified doctors can close a question')
      }
    }
    const updated = await this.prisma.question.update({
      where: { id },
      data: { title: dto.title, body: dto.body, tags: dto.tags, status: dto.status },
      include: { author: true },
    })
    return { data: updated }
  }

  async remove(id: string, userId: string) {
    const q = await this.prisma.question.findUnique({ where: { id } })
    if (!q) throw new NotFoundException('Question not found')
    if (q.author_id !== userId) throw new ForbiddenException('Only the author can delete this question')
    await this.prisma.question.delete({ where: { id } })
  }

  async vote(questionId: string, userId: string) {
    const q = await this.prisma.question.findUnique({ where: { id: questionId } })
    if (!q) throw new NotFoundException('Question not found')
    await this.prisma.questionVote.upsert({
      where: { user_id_question_id: { user_id: userId, question_id: questionId } },
      create: { user_id: userId, question_id: questionId },
      update: {},
    })
    const count = await this.prisma.questionVote.count({ where: { question_id: questionId } })
    return { data: { voteCount: count } }
  }

  async unvote(questionId: string, userId: string) {
    await this.prisma.questionVote.deleteMany({ where: { user_id: userId, question_id: questionId } })
    const count = await this.prisma.questionVote.count({ where: { question_id: questionId } })
    return { data: { voteCount: count } }
  }
}
