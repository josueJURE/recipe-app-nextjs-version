# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` (uses turbopack for faster builds)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint`
- **Tests**: `npm test` (runs Playwright tests)
- **Tests UI Mode**: `npm test:ui` (runs Playwright tests in UI mode)
- **Email Dev Server**: `npm run email` (runs React Email dev server)

## Architecture

This is a Next.js 15 app using the App Router with TypeScript and Tailwind CSS.

### Authentication
- Uses **better-auth** library with Prisma adapter
- Email/password authentication enabled
- Auth configuration in `src/lib/auth.ts` (server) and `src/lib/auth-client.ts` (client)
- Protected routes use `(auth)` route group pattern
- Database-backed sessions with PostgreSQL

### Database
- **Prisma ORM** with PostgreSQL
- Schema located in `prisma/schema.prisma`
- Generated client output: `src/generated/prisma/`
- Models: User, Session, Account, Verification (better-auth tables)
- After schema changes, run: `npx prisma generate` and `npx prisma db push`

### Context Architecture
- **ThemeProvider**: Manages dark mode state via `src/context/theme-context.tsx`. Wrapped around the entire app in layout.
- **RecipeVariablesContext**: Manages recipe form state including country selection, dietary requirements, and special requests in `src/context/recipe-variables-context.tsx`. Handles API submission to `/api/updateRecipe`.

### API Routes
- **`/api/updateRecipe`**: Generates traditional recipes via OpenAI API (gpt-3.5-turbo) with streaming responses. Also generates DALL-E 3 images based on recipes. Supports email delivery via Resend.
- **`/api/auth/[...all]`**: better-auth catch-all route handler
- **`/api/mock`**: Mock endpoint for testing

### UI Components
- Built with **Radix UI** primitives (checkbox, label, switch, slot)
- Custom components in `src/components/ui/`
- Styled with **Tailwind CSS 4** and `class-variance-authority` for component variants
- Uses **Geist** and **Geist Mono** fonts
- Form validation with **react-hook-form** and **Zod** (schemas in `src/lib/validation-schemas.tsx`)
- Toast notifications via **sonner**

### Key Features
- Interactive world map using **react-simple-maps** for country selection (`src/components/map.tsx`)
- Dark mode toggle functionality
- Recipe generation with streaming responses and AI-generated images
- Email delivery of recipes using **React Email** components (templates in `src/components/ui/Email/`)
- Audio playback with **wavesurfer.js**

### Route Structure
- `/` - Main recipe interface page
- `/(auth)/sign-in` - Sign in page
- `/(auth)/sign-up` - Sign up page
- `/login` - Legacy login page
- `/recipe-ui` - Recipe UI page

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for recipe generation
- `RESEND_API_KEY` - Resend API key for email delivery

### Testing
- **Playwright** for end-to-end testing
- Test files in `tests/` directory
- Example: `tests/updateRecipe.spec.ts` tests the recipe API endpoint
- Run tests with `npm test` or `npm test:ui`

### Path Aliases
- `@/*` maps to `./src/*` for cleaner imports
