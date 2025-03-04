/*
  Warnings:

  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column with a default value
ALTER TABLE "Order" ADD COLUMN "status" TEXT DEFAULT 'PENDING';

-- Update existing records
UPDATE "Order" SET status = 'COMPLETED' WHERE status IS NULL;

-- Make the column required
ALTER TABLE "Order" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
