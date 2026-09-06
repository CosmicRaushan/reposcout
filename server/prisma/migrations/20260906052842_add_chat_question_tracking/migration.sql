-- CreateEnum
CREATE TYPE "ChatQuestionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ChatQuestion" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" "ChatQuestionStatus" NOT NULL DEFAULT 'PENDING',
    "answer" TEXT,
    "sources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatQuestion_repositoryId_idx" ON "ChatQuestion"("repositoryId");

-- CreateIndex
CREATE INDEX "ChatQuestion_userId_idx" ON "ChatQuestion"("userId");

-- CreateIndex
CREATE INDEX "ChatQuestion_status_idx" ON "ChatQuestion"("status");

-- AddForeignKey
ALTER TABLE "ChatQuestion" ADD CONSTRAINT "ChatQuestion_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatQuestion" ADD CONSTRAINT "ChatQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
