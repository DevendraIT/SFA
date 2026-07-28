-- Add missing columns to Session table that are defined in Prisma schema
-- but missing from the actual database

ALTER TABLE "Session"
  ADD COLUMN IF NOT EXISTS "browser" TEXT,
  ADD COLUMN IF NOT EXISTS "device" TEXT,
  ADD COLUMN IF NOT EXISTS "loginAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;

-- Create unique index for refreshToken
CREATE UNIQUE INDEX IF NOT EXISTS "Session_refreshToken_key" ON "Session"("refreshToken");

