/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the columns with default values
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Update existing records with default values
UPDATE "Restaurant" SET 
  username = CONCAT('user_', id),
  password = 'default_password'
WHERE username IS NULL OR password IS NULL;

-- Make the columns required
ALTER TABLE "Restaurant" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "Restaurant" ALTER COLUMN "password" SET NOT NULL;

-- Add unique constraint to username (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Restaurant_username_key'
    ) THEN
        ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_username_key" UNIQUE ("username");
    END IF;
END $$;
