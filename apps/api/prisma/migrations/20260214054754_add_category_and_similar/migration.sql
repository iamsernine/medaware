-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('GENERAL', 'SYMPTOMS', 'MEDICATION', 'DIAGNOSIS', 'OTHER');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "category" "QuestionCategory" NOT NULL DEFAULT 'GENERAL';
