import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { UpdateAnswerDto } from './dto/update-answer.dto'

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  async create(questionId: string, userId: string, dto: CreateAnswerDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new ForbiddenException('User not found')
    const question = await this.prisma.question.findUnique({ where: { id: questionId } })
    if (!question) throw new NotFoundException('Question not found')
    if (question.status === 'CLOSED') throw new ForbiddenException('Question is closed')
    const answer = await this.prisma.answer.create({
      data: { question_id: questionId, doctor_id: userId, body: dto.body },
      include: { doctor: true },
    })
    return { data: answer }
  }

  async update(id: string, userId: string, dto: UpdateAnswerDto) {
    const answer = await this.prisma.answer.findUnique({ where: { id } })
    if (!answer) throw new NotFoundException('Answer not found')
    if (answer.doctor_id !== userId) throw new ForbiddenException('Only the author can update this answer')
    const updated = await this.prisma.answer.update({
      where: { id },
      data: dto,
      include: { doctor: true },
    })
    return { data: updated }
  }

  async remove(id: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id } })
    if (!answer) throw new NotFoundException('Answer not found')
    if (answer.doctor_id !== userId) throw new ForbiddenException('Only the author can delete this answer')
    await this.prisma.answer.delete({ where: { id } })
  }

  async vote(answerId: string, userId: string) {
    const a = await this.prisma.answer.findUnique({ where: { id: answerId } })
    if (!a) throw new NotFoundException('Answer not found')
    await this.prisma.answerVote.upsert({
      where: { user_id_answer_id: { user_id: userId, answer_id: answerId } },
      create: { user_id: userId, answer_id: answerId },
      update: {},
    })
    const count = await this.prisma.answerVote.count({ where: { answer_id: answerId } })
    return { data: { voteCount: count } }
  }

  async unvote(answerId: string, userId: string) {
    await this.prisma.answerVote.deleteMany({ where: { user_id: userId, answer_id: answerId } })
    const count = await this.prisma.answerVote.count({ where: { answer_id: answerId } })
    return { data: { voteCount: count } }
  }
}
