/*
  Warnings:

  - You are about to drop the column `recodeDate` on the `DailyRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId,serviceId,date]` on the table `DailyRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `DailyRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyRecord_clientId_serviceId_recodeDate_key";

-- AlterTable
ALTER TABLE "DailyRecord" DROP COLUMN "recodeDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DEFAULT '/defaultAvatar.jpg';

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecord_clientId_serviceId_date_key" ON "DailyRecord"("clientId", "serviceId", "date");
