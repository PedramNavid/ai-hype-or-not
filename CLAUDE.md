# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Hype or Not is a Next.js 15.2.4 web application that reviews AI products and tools, categorizing them as either "LEGIT" or "OVERHYPED" with a 1-5 star hype score rating system.

## Development Commands

```bash
# Install dependencies (using bun as default)
bun install

# Start development server with Turbopack
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run database migration (creates schema and seeds data)
bun run db:migrate

# Connect to database via psql
psql $DATABASE_URL
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon) - access via `psql` with env vars from `.env.local`
- **Authentication**: NextAuth.js with GitHub/Google OAuth
- **Styling**: Tailwind CSS v4 with PostCSS, tw-animate-css for animations
- **UI Components**: Custom components following shadcn/ui patterns with Radix UI primitives
- **Icons**: Lucide React

### Key Directories
- `app/`: Next.js App Router pages and layouts
  - `app/workflow/[slug]/`: Dynamic workflow detail pages
  - `app/authors/[slug]/`: Public author profile pages
  - `app/submit/`: Tool submission form page
  - `app/about/`: About page explaining review process
  - `app/admin/`: Admin panel for content management (protected routes)
    - `app/admin/workflows/`: Workflow CRUD operations
    - `app/admin/authors/`: Author management
    - `app/admin/submissions/`: Review user submissions
  - `app/api/auth/`: NextAuth.js authentication endpoints
  - `app/api/admin/`: Admin-only API routes
  - `app/api/authors/`: Public author data endpoints
- `components/`: React components
  - `components/ui/`: Base UI components (shadcn/ui pattern)
- `lib/`: Utility functions (mainly `cn` for classnames)

### Component Patterns
- All components use TypeScript with typed props
- UI components follow shadcn/ui patterns with class-variance-authority (CVA) for variants
- Styling uses Tailwind utility classes with `cn()` helper from `lib/utils.ts`
- Components are functional with hooks for state management

### Current Implementation Notes
- **Data Storage**: PostgreSQL database via Neon (@neondatabase/serverless)
- **Database Access**: Connect via `psql` using environment variables from `.env.local`
- **Content Model**: Workflows with author attribution, tools, and step-by-step guides
- **Author Management**: Full CRUD operations for author profiles with social links
- **Routing**: File-based with dynamic routes for workflows and authors
- **Theming**: CSS custom properties defined for light/dark theme support
- **Testing**: Jest with React Testing Library for unit and integration tests

## Important Files
- `app/page.tsx`: Homepage with workflow listing
- `app/workflow/[slug]/page.tsx`: Workflow detail pages with author attribution
- `app/authors/[slug]/page.tsx`: Public author profile pages
- `app/admin/workflows/`: Workflow management (create, edit, assign authors)
- `app/admin/authors/`: Author management (CRUD operations)
- `app/api/admin/workflows/`: Workflow API routes
- `app/api/admin/authors/`: Author management API routes
- `app/api/authors/[slug]/route.ts`: Public author profile API
- `lib/utils.ts`: Contains `cn()` utility for classname merging
- `lib/db.ts`: Database connection and query functions
- `db/workflow-schema.sql`: Main database schema with users/workflows
- `db/workflow-seed-data.sql`: Initial workflow and author data
- `db/add-author-fields.sql`: Author profile enhancements (slug, LinkedIn)

## Admin Panel

The site includes a protected admin panel for content management at `/admin`. 

### Authentication
- Uses NextAuth.js with GitHub and Google OAuth providers
- Only authorized email addresses can access the admin panel
- No password authentication - OAuth only

### Features
- Dashboard with workflow and submission statistics
- **Workflow Management**: Full CRUD operations with author assignment
- **Author Management**: Create/edit author profiles with social media links
- **Submission Review**: Review community-submitted workflows
- Protected routes with middleware

### Required Environment Variables
Add these to your `.env.local` file:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth  
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Admin Access
ADMIN_EMAILS=your-email@example.com,another-admin@example.com

# AI Website Parsing (Optional)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### Setup Instructions
1. Create GitHub OAuth App at https://github.com/settings/applications/new
2. Create Google OAuth credentials at https://console.cloud.google.com/
3. Add your email address to `ADMIN_EMAILS` environment variable
4. (Optional) Add `ANTHROPIC_API_KEY` for AI-powered website parsing feature
5. Access admin panel at `/admin` after authentication

### AI Website Parsing Feature
The admin panel includes an AI-powered website parsing feature that can extract workflow information from existing web content:

- **Purpose**: Automatically create workflow submissions by parsing development tutorials, documentation, and blog posts
- **Access**: Click "Parse Website" button in the admin submissions page
- **Requirements**: Requires `ANTHROPIC_API_KEY` environment variable
- **Supported Content**: Works best with technical blog posts, GitHub READMEs, documentation, and tutorial content
- **Process**: 
  1. Enter URL of the website/tutorial
  2. AI extracts workflow information (title, steps, tools, etc.)
  3. Review and edit the parsed data
  4. Create submission with pre-populated content

## Development Best Practices

### Database Schema Evolution
- **Schema Updates**: Use separate migration files (e.g., `db/add-author-fields.sql`) for incremental changes
- **Field Additions**: When adding new fields to existing tables, use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for safety
- **Unique Constraints**: Always add unique indexes for slug fields to ensure URL uniqueness
- **Foreign Key Validation**: Validate related entity existence before inserting/updating (e.g., author_id validation)

### API Route Patterns
- **CRUD Consistency**: Follow REST conventions - `GET/POST` for collections, `GET/PUT/DELETE` for individual resources
- **Admin Authorization**: Always check admin permissions using the `isAdmin()` helper function
- **Error Handling**: Return appropriate HTTP status codes (401, 404, 500) with descriptive error messages
- **Data Validation**: Validate required fields and foreign key relationships before database operations

### Form State Management
- **Author Selection**: Use dropdown selects for entity relationships, pre-populate with current values on edit forms
- **Real-time Updates**: Auto-generate slugs from names, but allow manual editing for customization
- **Concurrent Data**: Fetch related data (authors list) alongside main entity data for form dropdowns

### Next.js App Router Patterns
- **Dynamic Routes**: Use `[slug]` patterns for SEO-friendly URLs (`/authors/john-doe`, `/workflow/react-setup`)
- **Server Components**: Prefer server components for data fetching, use client components only when needed for interactivity
- **Params Handling**: In Next.js 15, params are Promise objects - always await them: `const { slug } = await params`
- **Public vs Admin**: Separate public (`/api/authors/`) and admin (`/api/admin/authors/`) API endpoints

### UI/UX Considerations
- **Clickable Author Links**: Make author information clickable throughout the app (workflow pages → author profiles)
- **Social Media Integration**: Include all major platforms (GitHub, Twitter, LinkedIn, Website) with proper icons
- **Navigation Context**: Add breadcrumbs and back links to maintain user orientation
- **Responsive Design**: Ensure forms and lists work well on both desktop and mobile

### TypeScript Integration
- **Interface Consistency**: Define interfaces for all data structures and reuse across components
- **Promise Params**: Handle Next.js 15's Promise-based params correctly in page components
- **API Response Types**: Type API responses to catch errors during development

### Performance Optimizations
- **Database Queries**: Use joins to fetch related data in single queries (workflow + author info)
- **Index Usage**: Create indexes on frequently queried fields (slugs, foreign keys)
- **Image Optimization**: Use Next.js Image component for avatars and provide fallbacks for missing images