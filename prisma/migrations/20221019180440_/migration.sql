/*
  Warnings:

  - You are about to drop the column `allowedNetworks` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the column `requesterId` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the `S3Storage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bucket` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_bucket` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_cid` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_key` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originatorId` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signerIdentifier` to the `Signature` table without a default value. This is not possible if the table is not empty.
  - Made the column `network` on table `Signature` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "S3Storage" DROP CONSTRAINT "S3Storage_agreementId_fkey";

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "allowedNetworks",
DROP COLUMN "requesterId",
ADD COLUMN     "bucket" TEXT NOT NULL,
ADD COLUMN     "description_bucket" TEXT NOT NULL,
ADD COLUMN     "description_cid" TEXT NOT NULL,
ADD COLUMN     "description_key" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "network" "Network" NOT NULL DEFAULT 'SOLANA',
ADD COLUMN     "originatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Signature" ADD COLUMN     "signerIdentifier" TEXT NOT NULL,
ALTER COLUMN "network" SET NOT NULL,
ALTER COLUMN "network" SET DEFAULT 'SOLANA';

-- DropTable
DROP TABLE "S3Storage";

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_originatorId_fkey" FOREIGN KEY ("originatorId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
