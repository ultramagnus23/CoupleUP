-- Add provider column (instagram/google), default to 'instagram' for existing rows
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'instagram';

-- Add photo_uploaded column, default false for new rows
-- Existing Instagram users are treated as having uploaded (they use the Instagram photo directly)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "photo_uploaded" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: mark all existing Instagram users as photo_uploaded = true
UPDATE "users" SET "photo_uploaded" = true WHERE "provider" = 'instagram';
