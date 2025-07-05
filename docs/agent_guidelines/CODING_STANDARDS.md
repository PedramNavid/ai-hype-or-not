# Coding Standards

## TypeScript/React
- Use functional components with TypeScript interfaces
- Prefer `interface` over `type` for component props
- Use async/await over promises
- Handle all error cases explicitly

## File Structure
- Components: `/components/feature-name/ComponentName.tsx`
- API routes: `/app/api/resource/route.ts`
- Database queries: `/lib/db.ts`
- Types: Colocate with usage, shared types in `/types/`

## Naming
- Components: PascalCase (`UserProfile.tsx`)
- Functions/variables: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Database: snake_case (`user_profiles`)

## Next.js 15
- Await params in dynamic routes: `const { slug } = await params`
- Use server components by default, client only when needed
- Separate public (`/api/`) and admin (`/api/admin/`) routes

## Database
- Always validate foreign keys before insert/update
- Use transactions for multi-table operations
- Add `IF NOT EXISTS` to schema migrations
- Create indexes on foreign keys and slugs

## UI/Styling
- Use Tailwind utilities with `cn()` helper
- Follow shadcn/ui component patterns
- Keep components under 150 lines
- Extract reusable logic to custom hooks

## API Design
- REST conventions: GET/POST for collections, GET/PUT/DELETE for resources
- Return appropriate status codes (401, 404, 500)
- Always validate required fields
- Check admin auth with `isAdmin()` helper

## Testing
- Test file naming: `ComponentName.test.tsx`
- Cover happy path and edge cases
- Mock external dependencies
- Run tests before commits: `npm run test`