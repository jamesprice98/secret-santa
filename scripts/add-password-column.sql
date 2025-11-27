-- Add password column to Participant table
-- Run this in Vercel Postgres SQL Editor or via psql

ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "password" TEXT;

