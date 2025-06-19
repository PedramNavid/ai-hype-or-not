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
  - `app/product/[slug]/`: Dynamic product detail pages
  - `app/submit/`: Tool submission form page
  - `app/about/`: About page explaining review process
  - `app/admin/`: Admin panel for content management (protected routes)
  - `app/api/auth/`: NextAuth.js authentication endpoints
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
- **Form Submissions**: Submit form is frontend-only (no backend API)
- **Routing**: File-based with dynamic routes for products
- **Theming**: CSS custom properties defined for light/dark theme support
- **No Testing**: No test framework currently configured

## Important Files
- `app/page.tsx`: Homepage with product listing grid
- `components/product-card.tsx`: Reusable product card component
- `app/product/[slug]/page.tsx`: Product detail page template
- `components/submit-form.tsx`: Tool submission form component
- `lib/utils.ts`: Contains `cn()` utility for classname merging
- `lib/db.ts`: Database connection and query functions
- `db/schema.sql`: Database schema definition
- `db/seed-data.sql`: Initial data for seeding
- `app/api/products/`: API routes for product data
- `app/api/submissions/`: API route for form submissions
- `app/admin/`: Admin panel for content management
- `app/api/admin/`: Admin-only API routes for dashboard stats

## Admin Panel

The site includes a protected admin panel for content management at `/admin`. 

### Authentication
- Uses NextAuth.js with GitHub and Google OAuth providers
- Only authorized email addresses can access the admin panel
- No password authentication - OAuth only

### Features
- Dashboard with product and submission statistics
- Product management (planned)
- Submission review (planned)
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
```

### Setup Instructions
1. Create GitHub OAuth App at https://github.com/settings/applications/new
2. Create Google OAuth credentials at https://console.cloud.google.com/
3. Add your email address to `ADMIN_EMAILS` environment variable
4. Access admin panel at `/admin` after authentication