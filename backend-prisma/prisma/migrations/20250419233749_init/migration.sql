-- AlterTable
ALTER TABLE "TournamentParticipation" ADD COLUMN     "finalAngryInvestors" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finalBugs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finalFakeNews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finalPitches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finalTractions" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TournamentEvent" (
    "id" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "roundPhase" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TournamentEvent_participationId_idx" ON "TournamentEvent"("participationId");

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "TournamentParticipation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
