-- AlterTable: Add metadata JSON column to Task model
ALTER TABLE "Task" ADD COLUMN "metadata" JSONB;
