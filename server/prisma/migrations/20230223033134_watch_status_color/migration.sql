/*
  Warnings:

  - Added the required column `color` to the `WatchStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WatchStatus" ADD COLUMN     "color" TEXT NOT NULL;
