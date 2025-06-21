-- Add slug and linkedin_username fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS linkedin_username VARCHAR(255);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_slug ON users(slug);

-- Update existing users with slugs based on their names
UPDATE users 
SET slug = LOWER(REGEXP_REPLACE(REPLACE(name, ' ', '-'), '[^a-z0-9-]', '', 'g'))
WHERE slug IS NULL;

-- Update seed data with LinkedIn usernames
UPDATE users SET linkedin_username = 'harper-reed' WHERE email = 'harper@example.com';
UPDATE users SET linkedin_username = 'hamelhusain' WHERE email = 'hamel@example.com';
UPDATE users SET linkedin_username = 'alexchen' WHERE email = 'alex@example.com';