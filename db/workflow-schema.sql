-- Drop existing workflow tables if they exist
DROP TABLE IF EXISTS workflow_comments CASCADE;
DROP TABLE IF EXISTS workflow_saves CASCADE;
DROP TABLE IF EXISTS workflow_versions CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS workflow_tools CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (for workflow authors)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  github_username VARCHAR(255),
  twitter_username VARCHAR(255),
  website_url VARCHAR(500),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for auth lookups
CREATE INDEX idx_users_email ON users(email);

-- Create workflows table
CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_type VARCHAR(100) NOT NULL, -- e.g., 'greenfield', 'refactoring', 'debugging', 'testing'
  difficulty_level VARCHAR(50) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
  time_estimate VARCHAR(100), -- e.g., '30 minutes', '2-3 hours'
  content TEXT NOT NULL, -- Main workflow content in Markdown
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for workflows
CREATE INDEX idx_workflows_slug ON workflows(slug);
CREATE INDEX idx_workflows_author_id ON workflows(author_id);
CREATE INDEX idx_workflows_type ON workflows(workflow_type);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_featured ON workflows(is_featured) WHERE is_featured = TRUE;

-- Create workflow steps table (for structured step-by-step breakdown)
CREATE TABLE workflow_steps (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  code_snippet TEXT,
  prompt_template TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on workflow_id
CREATE INDEX idx_steps_workflow_id ON workflow_steps(workflow_id);

-- Create workflow tools table (many-to-many relationship)
CREATE TABLE workflow_tools (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL, -- e.g., 'Claude', 'Cursor', 'Aider', 'GitHub Copilot'
  tool_category VARCHAR(100), -- e.g., 'LLM', 'IDE', 'CLI'
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on workflow_id
CREATE INDEX idx_tools_workflow_id ON workflow_tools(workflow_id);
CREATE INDEX idx_tools_name ON workflow_tools(tool_name);

-- Create workflow versions table (for tracking iterations)
CREATE TABLE workflow_versions (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  change_summary TEXT NOT NULL,
  content TEXT NOT NULL, -- Snapshot of workflow content at this version
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on workflow_id
CREATE INDEX idx_versions_workflow_id ON workflow_versions(workflow_id);

-- Create workflow saves table (users can save workflows)
CREATE TABLE workflow_saves (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_id, user_id)
);

-- Create indexes for saves
CREATE INDEX idx_saves_workflow_id ON workflow_saves(workflow_id);
CREATE INDEX idx_saves_user_id ON workflow_saves(user_id);

-- Create workflow comments table
CREATE TABLE workflow_comments (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES workflow_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_author_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for comments
CREATE INDEX idx_comments_workflow_id ON workflow_comments(workflow_id);
CREATE INDEX idx_comments_user_id ON workflow_comments(user_id);
CREATE INDEX idx_comments_parent_id ON workflow_comments(parent_comment_id);

-- Create workflow submissions table (replaces product submissions)
CREATE TABLE workflow_submissions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  workflow_type VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  tools_used TEXT NOT NULL, -- JSON array of tools
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255) NOT NULL,
  github_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for admin queries
CREATE INDEX idx_workflow_submissions_status ON workflow_submissions(status);

-- Update the update_updated_at_column function (reuse existing)
-- Create triggers for updated_at on new tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_comments_updated_at BEFORE UPDATE ON workflow_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_submissions_updated_at BEFORE UPDATE ON workflow_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for workflow stats
CREATE VIEW workflow_stats AS
SELECT 
  w.id,
  w.slug,
  w.view_count,
  COUNT(DISTINCT ws.user_id) as save_count,
  COUNT(DISTINCT wc.id) as comment_count,
  COUNT(DISTINCT wv.id) as version_count
FROM workflows w
LEFT JOIN workflow_saves ws ON w.id = ws.workflow_id
LEFT JOIN workflow_comments wc ON w.id = wc.workflow_id
LEFT JOIN workflow_versions wv ON w.id = wv.workflow_id
GROUP BY w.id, w.slug, w.view_count;