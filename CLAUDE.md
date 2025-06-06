# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` (uses turbopack for faster builds)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint`

## Architecture

This is a Next.js 15 app using the App Router with TypeScript and Tailwind CSS.

### Context Architecture
- **ThemeProvider**: Manages dark mode state via `src/context/theme-context.tsx`. Wrapped around the entire app in `layout.tsx`.
- **RecipeVariablesContext**: Currently incomplete context for managing recipe form state in `src/context/recipe-variables-context.tsx`.

### API Integration
- Uses OpenAI API via `/api/updateRecipe` route to generate traditional recipes based on country selection
- Requires `openaiAPI` environment variable

### UI Components
- Built with Radix UI primitives and custom components in `src/components/ui/`
- Styled with Tailwind CSS and class-variance-authority for component variants
- Uses Geist fonts for typography

### Key Features
- Interactive world map using react-simple-maps for country selection
- Dark mode toggle functionality
- Recipe generation via OpenAI API

### Path Aliases
- `@/*` maps to `./src/*` for cleaner imports