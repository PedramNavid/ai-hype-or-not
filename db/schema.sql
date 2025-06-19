-- Drop existing tables if they exist
DROP TABLE IF EXISTS product_screenshots CASCADE;
DROP TABLE IF EXISTS product_pros CASCADE;
DROP TABLE IF EXISTS product_cons CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('LEGIT', 'OVERHYPED')),
  hype_score INTEGER NOT NULL CHECK (hype_score >= 1 AND hype_score <= 5),
  category VARCHAR(100) NOT NULL,
  website_url VARCHAR(500),
  full_review TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slug for faster lookups
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_verdict ON products(verdict);

-- Create product screenshots table
CREATE TABLE product_screenshots (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product_id for faster lookups
CREATE INDEX idx_screenshots_product_id ON product_screenshots(product_id);

-- Create product pros table
CREATE TABLE product_pros (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product_id
CREATE INDEX idx_pros_product_id ON product_pros(product_id);

-- Create product cons table
CREATE TABLE product_cons (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product_id
CREATE INDEX idx_cons_product_id ON product_cons(product_id);

-- Create submissions table for user-submitted tools
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  tool_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  why_review TEXT NOT NULL,
  your_role VARCHAR(100),
  email VARCHAR(255),
  additional_info TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'reviewed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for admin queries
CREATE INDEX idx_submissions_status ON submissions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();