-- CreateTable
CREATE TABLE "QuestionVote" (
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionVote_pkey" PRIMARY KEY ("user_id","question_id")
);

-- CreateTable
CREATE TABLE "AnswerVote" (
    "user_id" TEXT NOT NULL,
    "answer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerVote_pkey" PRIMARY KEY ("user_id","answer_id")
);

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
