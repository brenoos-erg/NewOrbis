-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('aberta', 'em_andamento', 'concluida', 'cancelada');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('baixa', 'media', 'alta');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('RH', 'DP');

-- CreateEnum
CREATE TYPE "RequestCategory" AS ENUM ('ferias', 'admissao', 'desligamento', 'beneficios', 'outros');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "department" "Department",
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "RequestCategory" NOT NULL,
    "department" "Department" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'aberta',
    "priority" "RequestPriority" NOT NULL DEFAULT 'media',
    "requesterId" TEXT NOT NULL,
    "slaDueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAssignee" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Request_createdAt_idx" ON "Request"("createdAt");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Request_department_idx" ON "Request"("department");

-- CreateIndex
CREATE UNIQUE INDEX "RequestAssignee_requestId_profileId_key" ON "RequestAssignee"("requestId", "profileId");

-- AddForeignKey
ALTER TABLE "RequestAssignee" ADD CONSTRAINT "RequestAssignee_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAssignee" ADD CONSTRAINT "RequestAssignee_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;