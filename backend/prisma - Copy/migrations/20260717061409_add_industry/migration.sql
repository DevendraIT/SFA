/*
  Warnings:

  - You are about to drop the column `industry` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Prospect` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "industry",
ADD COLUMN     "industryId" UUID;

-- AlterTable
ALTER TABLE "Prospect" DROP COLUMN "industry",
ADD COLUMN     "industryId" UUID;

-- CreateTable
CREATE TABLE "Industry" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_organizationId_code_key" ON "Industry"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_organizationId_name_key" ON "Industry"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "Industry" ADD CONSTRAINT "Industry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
