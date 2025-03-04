/*
  Warnings:

  - Added the required column `collapse` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "collapse" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
