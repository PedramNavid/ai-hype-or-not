# AGENTS.md

This file provides guidance to AI agents (like Cursor, Claude, GitHub Copilot, etc.) when working with the AI Hype or Not codebase.

## Project Overview

AI Hype or Not is a Next.js 15.2.4 web application that showcases developer workflows using LLMs. It features community-driven content, workflow submissions, and an admin panel for content management.

## Key Directories and Files

### Important Directories
- `app/` - Next.js App Router pages and API routes
  - `app/api/` - API endpoints (public and admin)
  - `app/admin/` - Admin panel pages (protected routes)
  - `app/workflow/[slug]/` - Dynamic workflow detail pages
  - `app/authors/[slug]/` - Public author profile pages
- `components/` - Reusable React components
  - `components/ui/` - Base UI components following shadcn/ui patterns
- `lib/` - Utility functions and database connections
- `db/` - Database schema and migration files

### Key Configuration Files
- `.env.local` - Environment variables (never commit)
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `CLAUDE.md` - Additional project-specific guidance

## Development Guidelines

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components following shadcn/ui patterns
- **Authentication**: NextAuth.js with OAuth

### Code Style

1. **TypeScript**
   - Always use TypeScript with proper type definitions
   - Define interfaces for all data structures
   - Avoid `any` types

2. **React Components**
   - Use functional components with hooks
   - Keep components small and focused
   - Use proper TypeScript props interfaces

3. **Styling**
   - Use Tailwind utility classes
   - Use `cn()` helper from `lib/utils.ts` for conditional classes
   - Follow existing color schemes and spacing

4. **File Naming**
   - Components: PascalCase (e.g., `WorkflowCard.tsx`)
   - Pages: kebab-case directories with `page.tsx`
   - API routes: kebab-case with `route.ts`

### Database Guidelines

1. **Schema Changes**
   - Create new migration files in `db/`
   - Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for safety
   - Always add indexes for foreign keys and slugs

2. **Queries**
   - Use parameterized queries with the `sql` template literal
   - Handle errors gracefully
   - Return appropriate HTTP status codes

### API Development

1. **Route Structure**
   - Public APIs: `/api/[resource]`
   - Admin APIs: `/api/admin/[resource]`
   - Always check authentication for admin routes

2. **Response Format**
   - Success: Return data directly or `{ success: true, data: ... }`
   - Error: `{ error: "Description" }` with appropriate status code

### Before Making Changes

1. **Read Existing Code**
   - Check similar components/features for patterns
   - Look at imports to understand dependencies
   - Follow existing conventions

2. **Validate Your Changes**
   ```bash
   # Run development server
   bun run dev
   
   # Run linting (if available)
   bun run lint
   
   # Build for production
   bun run build
   ```

3. **Test Your Changes**
   - Test all CRUD operations if modifying data
   - Check both authenticated and public access
   - Verify responsive design on mobile

### Common Tasks

#### Adding a New Workflow
1. Use the admin panel at `/admin/workflows/new`
2. Or use the "Parse Website" feature to extract from existing content

#### Adding a New Page
1. Create directory under `app/`
2. Add `page.tsx` with proper TypeScript types
3. Follow existing page patterns for consistency

#### Modifying Database Schema
1. Create a new migration file in `db/`
2. Test locally with `bun run db:migrate`
3. Update relevant TypeScript interfaces

#### Adding API Endpoints
1. Create `route.ts` in appropriate directory
2. Implement proper authentication checks
3. Handle errors with try/catch blocks
4. Return consistent response formats

### Important Notes

- **No Test Framework**: Currently no automated tests
- **Authentication**: OAuth only, no password auth
- **Environment Variables**: Check `.env.local.example` for required vars
- **Database Access**: Use `psql $DATABASE_URL` for direct access

### When Working on Features

1. **Understand the User Flow**
   - Public users browse and view workflows
   - Authenticated admins manage content
   - Community members submit workflows

2. **Maintain Consistency**
   - Follow existing UI patterns
   - Use established color schemes
   - Keep similar functionality consistent

3. **Performance Considerations**
   - Use server components where possible
   - Implement proper loading states
   - Cache data appropriately

### PR Guidelines

When submitting changes:
1. Provide clear description of changes
2. List any new dependencies added
3. Note any database migrations needed
4. Include screenshots for UI changes
5. Mention any environment variable additions

### Security Reminders

- Never commit `.env.local` or secrets
- Always validate user input
- Check authentication on protected routes
- Sanitize data before database insertion
- Use parameterized queries only