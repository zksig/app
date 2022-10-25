/*
  Warnings:

  - You are about to drop the column `originatorId` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_originatorId_fkey";

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "originatorId",
ADD COLUMN     "ownerAddress" TEXT NOT NULL DEFAULT 'AV3YQEkBnVZXhzW1vF7cS7Zzyoyrk5cGzGpyCCXNMLgn';

-- DropTable
DROP TABLE "UserProfile";
