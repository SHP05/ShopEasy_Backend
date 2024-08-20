-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyRecord" DROP CONSTRAINT "DailyRecord_clientId_fkey";

-- DropForeignKey
ALTER TABLE "DailyRecord" DROP CONSTRAINT "DailyRecord_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- AlterTable
ALTER TABLE "DailyRecord" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecord" ADD CONSTRAINT "DailyRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecord" ADD CONSTRAINT "DailyRecord_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
