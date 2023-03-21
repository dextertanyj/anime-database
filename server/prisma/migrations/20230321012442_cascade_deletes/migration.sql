-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_seriesId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_seriesId_fkey";

-- DropForeignKey
ALTER TABLE "WatchProgress" DROP CONSTRAINT "WatchProgress_seriesId_fkey";

-- DropForeignKey
ALTER TABLE "WatchProgress" DROP CONSTRAINT "WatchProgress_userId_fkey";

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchProgress" ADD CONSTRAINT "WatchProgress_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchProgress" ADD CONSTRAINT "WatchProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
