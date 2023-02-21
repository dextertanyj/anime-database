/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `WatchStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WatchStatusType" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "WatchStatus" ADD COLUMN     "type" "WatchStatusType";

-- CreateIndex
CREATE UNIQUE INDEX "WatchStatus_type_key" ON "WatchStatus"("type");
