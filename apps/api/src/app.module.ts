import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { QuestionsModule } from './questions/questions.module'
import { AnswersModule } from './answers/answers.module'
import { AppController } from './app.controller'

@Module({
  imports: [PrismaModule, UsersModule, QuestionsModule, AnswersModule],
  controllers: [AppController],
})
export class AppModule {}
