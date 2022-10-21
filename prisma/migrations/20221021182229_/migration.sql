/*
  Warnings:

  - You are about to drop the column `description_bucket` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the column `description_key` on the `Agreement` table. All the data in the column will be lost.
  - Added the required column `description` to the `Agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "description_bucket",
DROP COLUMN "description_key",
ADD COLUMN     "description" JSONB NOT NULL;
