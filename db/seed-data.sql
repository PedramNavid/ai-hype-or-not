-- Clear existing data
TRUNCATE products, product_screenshots, product_pros, product_cons, submissions RESTART IDENTITY CASCADE;

-- Insert products
INSERT INTO products (name, slug, tagline, description, verdict, hype_score, category, website_url, full_review) VALUES
-- Cursor
('Cursor', 'cursor', 'The AI-powered code editor that actually delivers',
'AI-enhanced code editor with intelligent autocomplete',
'LEGIT', 5, 'Code Editor',
'https://cursor.com',
'Cursor has quickly become my go-to code editor after years of using VS Code. The AI features aren''t just bolted on—they''re deeply integrated in a way that feels natural and actually improves productivity.

What sets Cursor apart from other AI coding tools is its seamless integration. The AI suggestions feel natural and don''t interrupt your flow. The chat interface is incredibly powerful for explaining complex code or getting help with debugging.

Performance is excellent, and it handles large codebases without breaking a sweat. The team behind Cursor clearly understands developers'' needs and has created something that actually makes you more productive rather than just being a novelty.

This is the future of coding, and it''s available today.'),

-- Windsurf
('Windsurf', 'windsurf', 'AI-first IDE for modern development',
'AI-first IDE for building software faster',
'LEGIT', 4, 'Code Editor',
'https://windsurf.com',
'Windsurf positions itself as an AI-first IDE, and it largely delivers on that promise. The interface is clean and modern, clearly designed with AI workflows in mind.

The AI assistant is quite capable and integrates well with the development environment. Code suggestions are generally accurate, and the ability to have contextual conversations about your codebase is valuable.

Where Windsurf shines is in its project understanding. It seems to grasp the architecture and patterns of your application better than many competitors, leading to more relevant suggestions and better debugging assistance.

However, it''s still finding its footing in some areas. The ecosystem isn''t as mature as established editors, and some advanced features feel like they need more polish.

That said, the trajectory is promising, and for teams looking to embrace AI-first development, Windsurf is definitely worth considering.'),

-- Graphite
('Graphite', 'graphite', 'Stacked diffs for modern code review',
'Modern code review and CI/CD platform',
'OVERHYPED', 2, 'Developer Tools',
'https://graphite.dev',
'Graphite promises to modernize the code review process, but after extensive testing, I''m not convinced it delivers enough value to justify switching from established tools.

The stacked diffs concept is interesting in theory, but in practice, it adds complexity without clear benefits for most development workflows. The learning curve is steep, and team adoption has been challenging.

The UI is polished and the performance is decent, but the core value proposition feels weak. GitHub''s native code review tools, while not perfect, are more intuitive and have better ecosystem integration.

Graphite''s CI/CD features are basic compared to dedicated platforms like GitHub Actions or CircleCI. It feels like they''re trying to do too many things without excelling at any particular one.

For teams already happy with their current code review process, Graphite doesn''t offer compelling reasons to switch. The "modern" approach often feels like change for change''s sake rather than meaningful improvement.'),

-- Lovable
('Lovable', 'lovable', 'Build apps with AI, no coding required',
'AI-powered app builder for rapid prototyping',
'LEGIT', 4, 'No-Code',
'https://lovable.dev',
'Lovable represents a significant leap forward in the no-code space. Unlike many no-code tools that feel limiting, Lovable uses AI to create surprisingly sophisticated applications.

The natural language interface is intuitive, and the AI understands complex requirements better than expected. I was able to build a functional SaaS MVP in hours, not days, with features that would typically require significant coding.

The generated code is clean and actually maintainable if you need to export and customize it later. This is a huge advantage over traditional no-code platforms that lock you in.

Performance of generated apps is solid, and the deployment process is seamless. The platform handles responsive design well, producing applications that look professional on all devices.

While it can''t replace custom development for complex applications, Lovable is perfect for MVPs, prototypes, and even production apps with standard requirements.'),

-- GitHub Copilot
('GitHub Copilot', 'github-copilot', 'Your AI pair programmer',
'AI pair programmer that suggests code completions',
'LEGIT', 4, 'AI Assistant',
'https://github.com/features/copilot',
'GitHub Copilot might not be the newest AI coding tool anymore, but it remains one of the most reliable and valuable.

The autocomplete suggestions are consistently helpful, especially for boilerplate code, test writing, and common patterns. It excels at understanding context from comments and function names, often generating exactly what you intended to write.

Integration with VS Code and other popular editors is seamless. The suggestions appear naturally as you type, without being intrusive. The ability to cycle through multiple suggestions is particularly useful.

Where Copilot shines is in its consistency. While it may not have the advanced chat features of newer tools, it reliably speeds up coding by handling the repetitive parts, letting you focus on logic and architecture.

At $10/month for individuals, it easily pays for itself in time saved. For teams, the business features add valuable policy controls and security.'),

-- Replit Agent
('Replit Agent', 'replit-agent', 'AI that builds complete applications',
'AI agent that builds software from natural language',
'LEGIT', 3, 'AI Assistant',
'https://replit.com/agent',
'Replit Agent represents an ambitious attempt to automate software development through natural language instructions. The concept is fascinating: describe what you want, and the AI builds it.

In practice, results are mixed but often impressive. For simple applications like landing pages, basic CRUD apps, or prototype tools, Replit Agent can produce working code in minutes. The integration with Replit''s environment means you can immediately run and test the generated applications.

The agent excels at standard web applications using common frameworks. It understands requirements reasonably well and can iterate based on feedback. Watching it work feels like glimpsing the future of development.

However, limitations become apparent with complex requirements. The agent sometimes makes questionable architectural decisions or implements features in convoluted ways. Debugging its output can be challenging when things go wrong.

Despite limitations, Replit Agent is valuable for rapid prototyping and learning. It''s particularly useful for non-developers who need simple tools or developers who want to quickly test ideas.');

-- Get the inserted product IDs
DO $$
DECLARE
  cursor_id INTEGER;
  windsurf_id INTEGER;
  graphite_id INTEGER;
  lovable_id INTEGER;
  copilot_id INTEGER;
  replit_id INTEGER;
BEGIN
  SELECT id INTO cursor_id FROM products WHERE slug = 'cursor';
  SELECT id INTO windsurf_id FROM products WHERE slug = 'windsurf';
  SELECT id INTO graphite_id FROM products WHERE slug = 'graphite';
  SELECT id INTO lovable_id FROM products WHERE slug = 'lovable';
  SELECT id INTO copilot_id FROM products WHERE slug = 'github-copilot';
  SELECT id INTO replit_id FROM products WHERE slug = 'replit-agent';

  -- Insert pros for Cursor
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (cursor_id, 'Incredibly accurate code predictions', 1),
  (cursor_id, 'Seamless AI integration that doesn''t interrupt flow', 2),
  (cursor_id, 'Excellent performance with large codebases', 3),
  (cursor_id, 'Intuitive chat interface for code explanations', 4),
  (cursor_id, 'Regular updates with meaningful improvements', 5);

  -- Insert cons for Cursor
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (cursor_id, 'Subscription pricing might be steep for some', 1),
  (cursor_id, 'Learning curve to fully utilize AI features', 2),
  (cursor_id, 'Limited customization compared to traditional editors', 3);

  -- Insert pros for Windsurf
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (windsurf_id, 'Excellent project-wide context understanding', 1),
  (windsurf_id, 'Clean, modern interface designed for AI workflows', 2),
  (windsurf_id, 'Strong debugging assistance', 3),
  (windsurf_id, 'Good integration with popular frameworks', 4);

  -- Insert cons for Windsurf
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (windsurf_id, 'Smaller ecosystem compared to established IDEs', 1),
  (windsurf_id, 'Some features still need polish', 2),
  (windsurf_id, 'Limited plugin/extension support', 3),
  (windsurf_id, 'Occasional performance hiccups with very large projects', 4);

  -- Insert pros for Graphite
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (graphite_id, 'Clean, modern interface', 1),
  (graphite_id, 'Decent performance', 2),
  (graphite_id, 'Stacked diffs for complex changes', 3),
  (graphite_id, 'Good documentation', 4);

  -- Insert cons for Graphite
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (graphite_id, 'Steep learning curve with questionable benefits', 1),
  (graphite_id, 'Limited ecosystem integration', 2),
  (graphite_id, 'Basic CI/CD features compared to dedicated tools', 3),
  (graphite_id, 'Difficult team adoption', 4),
  (graphite_id, 'Expensive for what it offers', 5);

  -- Insert pros for Lovable
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (lovable_id, 'Natural language understanding is impressive', 1),
  (lovable_id, 'Generates clean, maintainable code', 2),
  (lovable_id, 'No vendor lock-in - can export code', 3),
  (lovable_id, 'Rapid MVP development', 4),
  (lovable_id, 'Great for non-technical founders', 5);

  -- Insert cons for Lovable
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (lovable_id, 'Limited customization for complex requirements', 1),
  (lovable_id, 'Can be expensive for larger applications', 2),
  (lovable_id, 'AI sometimes misunderstands requirements', 3),
  (lovable_id, 'Not suitable for highly specialized apps', 4);

  -- Insert pros for GitHub Copilot
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (copilot_id, 'Excellent IDE integration', 1),
  (copilot_id, 'Consistent and reliable suggestions', 2),
  (copilot_id, 'Great for boilerplate and repetitive code', 3),
  (copilot_id, 'Affordable pricing', 4),
  (copilot_id, 'Strong security and privacy features for enterprise', 5);

  -- Insert cons for GitHub Copilot
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (copilot_id, 'Limited compared to newer AI tools', 1),
  (copilot_id, 'No chat or advanced features', 2),
  (copilot_id, 'Sometimes suggests outdated patterns', 3),
  (copilot_id, 'Can encourage lazy coding habits', 4);

  -- Insert pros for Replit Agent
  INSERT INTO product_pros (product_id, text, display_order) VALUES
  (replit_id, 'Can build complete applications autonomously', 1),
  (replit_id, 'Great for learning and experimentation', 2),
  (replit_id, 'Integrated development environment', 3),
  (replit_id, 'Impressive for simple applications', 4);

  -- Insert cons for Replit Agent
  INSERT INTO product_cons (product_id, text, display_order) VALUES
  (replit_id, 'Struggles with complex requirements', 1),
  (replit_id, 'Generated code can be convoluted', 2),
  (replit_id, 'Limited control over architecture decisions', 3),
  (replit_id, 'Debugging generated code can be challenging', 4),
  (replit_id, 'Results are inconsistent', 5);

  -- Insert placeholder screenshots for all products
  INSERT INTO product_screenshots (product_id, image_url, caption, display_order) VALUES
  (cursor_id, '/placeholder.svg?height=300&width=500', 'Cursor Editor Interface', 1),
  (cursor_id, '/placeholder.svg?height=300&width=500', 'AI Chat Feature', 2),
  (cursor_id, '/placeholder.svg?height=300&width=500', 'Code Completion in Action', 3),
  (windsurf_id, '/placeholder.svg?height=300&width=500', 'Windsurf Main Interface', 1),
  (windsurf_id, '/placeholder.svg?height=300&width=500', 'AI Assistant Panel', 2),
  (windsurf_id, '/placeholder.svg?height=300&width=500', 'Project Overview', 3),
  (graphite_id, '/placeholder.svg?height=300&width=500', 'Graphite Code Review', 1),
  (graphite_id, '/placeholder.svg?height=300&width=500', 'Stacked Diffs View', 2),
  (graphite_id, '/placeholder.svg?height=300&width=500', 'CI/CD Dashboard', 3),
  (lovable_id, '/placeholder.svg?height=300&width=500', 'Lovable Builder Interface', 1),
  (lovable_id, '/placeholder.svg?height=300&width=500', 'Natural Language Input', 2),
  (lovable_id, '/placeholder.svg?height=300&width=500', 'Generated App Preview', 3),
  (copilot_id, '/placeholder.svg?height=300&width=500', 'Copilot in VS Code', 1),
  (copilot_id, '/placeholder.svg?height=300&width=500', 'Code Suggestions', 2),
  (copilot_id, '/placeholder.svg?height=300&width=500', 'Multiple Completion Options', 3),
  (replit_id, '/placeholder.svg?height=300&width=500', 'Replit Agent Interface', 1),
  (replit_id, '/placeholder.svg?height=300&width=500', 'Building an App', 2),
  (replit_id, '/placeholder.svg?height=300&width=500', 'Generated Application', 3);
END $$;