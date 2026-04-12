<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Init

When starting work in this repo:

1. Read this file first.
2. Inspect `package.json` to confirm scripts, dependencies, and the installed Next.js version.
3. Before writing or changing code, read the relevant guide in `node_modules/next/dist/docs/` for the feature you are touching.
4. Inspect the repository structure before adding files:
   - `app/` for routes, layouts, and route-local components
   - `components/` for shared app components
   - `components/ui/` for shadcn primitives
   - `lib/` for utilities, shared types, services, db helpers, and llm helpers
   - `db/` for migrations and seed scripts
   - `hooks/` for shared React hooks
   - `public/` for static assets
   - `scripts/` for local development or verification scripts
5. Review nearby files before changing anything so new code follows local patterns instead of introducing a parallel style.
6. Check whether an existing shadcn/ui component already solves the need before building anything custom.
7. Check the env surface in `.env.example` and any existing server-only env usage before introducing new configuration.
8. Default to Server Components, verify server/client boundaries before editing, and look for existing patterns in nearby route files first.
9. Identify the verification command before making changes. For app code, `npm run build` is the minimum completion gate unless the task is docs-only or otherwise exempt.

## Repository Structure

Current top-level structure:

- `app/` contains the App Router entrypoints, including the root layout, the root redirect page, and the `dashboard/` route
- `components/` contains shared application components such as dashboard UI and providers
- `components/ui/` contains shadcn/ui primitives and should be treated as the component source of truth
- `lib/` contains shared utilities and app logic, including `lib/utils.ts`, `lib/db.ts`, constants, services, types, and llm helpers
- `db/` contains SQL migrations plus local migration and seed scripts
- `hooks/` contains shared hooks
- `public/` contains static assets served by Next.js
- `scripts/` contains standalone development helpers such as local llm testing scripts
- Root config files include `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`, and env example files

When adding new code:

- Put route-specific components next to the route in `app/` when they are not reused elsewhere
- Put reusable components in `components/`
- Put reusable utilities, typed helpers, db logic, and shared services in `lib/`
- Put schema or content migration work in `db/`
- Avoid creating new top-level folders unless there is a clear reason

## Project

Next.js 15 App Router app using TypeScript, Tailwind CSS, and shadcn/ui. Deployed on Vercel.

## Stack

Do not deviate without asking.

- Framework: Next.js 15 (App Router, not Pages Router)
- Language: TypeScript, strict mode
- Styling: Tailwind CSS only. No CSS modules, no styled-components, no inline style objects except for dynamic values.
- Components: shadcn/ui (in `@/components/ui`). Always check if a component already exists before building one. If a needed shadcn component isn't installed, tell the user to run `npx shadcn@latest add <component>` and do not reimplement it.
- Icons: `lucide-react`
- Forms: `react-hook-form` + `zod` + `@/components/ui/form`
- Validation: `zod` for all external input (forms, API routes, Server Actions)
- Notifications: `sonner` (`<Toaster />` already mounted in root layout)
- Dates: `date-fns`
- Theming: `next-themes`, class-based dark mode

## Architecture Rules

- Server Components by default. Only add `"use client"` when state, effects, or browser APIs are required.
- Data mutations go through Server Actions in `app/**/actions.ts`, not API routes, unless there is a specific reason.
- Fetch data in Server Components with `async`/`await`. Do not add SWR or React Query unless asked.
- Co-locate route-specific components in the route folder. Shared components go in `components/`.
- Path alias `@/*` maps to the project root.

## File Layout

- `app/` for routes, layouts, and server actions
- `components/ui/` for shadcn primitives; do not edit these casually
- `components/` for shared app components
- `lib/` for utilities, db client, and auth helpers
- `lib/utils.ts` contains the `cn()` helper and should be used for conditional classes

## Design Principles

- Use Inter or Geist via `next/font`
- Max content width: `max-w-6xl` or `max-w-7xl` for dashboards, centered with `mx-auto px-4 sm:px-6 lg:px-8`
- Spacing: stick to Tailwind's `4/6/8/12/16` scale. No arbitrary values unless necessary.
- Colors: use semantic tokens such as `bg-background`, `text-foreground`, `border-border`, `bg-muted`, and `text-muted-foreground`. Never hardcode hex values or `gray-500`.
- Borders: use `border-border`, not `border-gray-200`
- Radius: use `rounded-lg` or `rounded-xl`, matching shadcn defaults
- Every data view needs a loading state (`Skeleton`), empty state, and error state
- Every form needs inline validation, disabled submit while pending, and success/error toast feedback
- Dark mode must work and be tested if styling changes

## Code Style

- Use named exports for components. Use default exports only for Next.js route files such as `page.tsx` and `layout.tsx`.
- Props interfaces should be named `ComponentNameProps`
- Do not use `any`. Use `unknown` and narrow it, or define the type explicitly.
- Prefer early returns over nested conditionals
- Keep components under roughly 150 lines; extract subcomponents when they grow past that

## Before Finishing

- Make sure `npm run build` would pass with no type errors and no server/client boundary violations
- Check that imports use `@/` paths instead of relative `../../`
- Confirm dark mode still looks correct if styling changed
- If you added a dependency, tell the user the install command

## What Not To Do

- Do not add UI libraries other than shadcn/ui
- Do not use `useEffect` for data fetching in Server Component territory
- Do not create `pages/` directory files
- Do not commit `.env` files or hardcode secrets
- Do not reimplement shadcn components from scratch
- Do not use `<img>`; use `next/image`
- Do not use `<a>` for internal links; use `next/link`
