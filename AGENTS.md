# Repository Guidelines

## Project Structure & Module Organization

This directory currently contains only `prompt.txt`, the Portuguese GymCore product and implementation brief. There is no application scaffold, test suite, dependency manifest, or Git metadata here. Treat the brief as requirements; distinguish implemented features from proposals and simulated integrations.

When scaffolding, the brief specifies a Next.js web prototype if no application exists. Recommended locations are `src/app/` for routes, `src/components/` for reusable UI, `src/lib/` for utilities and fixtures, `public/` for static assets, and `docs/` for design specifications and handoff. These directories are proposed, not existing. Identify student and reception tablet previews as web prototypes; document Flutter separately unless a native project is added.

## Build, Test, and Development Commands

No build, development, lint, or test commands are currently configured. After scaffolding, document the chosen package manager, installation command, and actual scripts in the README. For an npm-based Next.js scaffold, provide `npm run dev`, `npm run build`, and appropriate lint and test scripts before recommending their use.

## Coding Style & Naming Conventions

Follow the framework and formatter configuration introduced with the scaffold. Recommended defaults are TypeScript, two-space indentation, PascalCase component names, camelCase functions and variables, and descriptive route directories. Centralize colors, spacing, typography, and motion tokens. Configure linting and formatting explicitly; neither tool is installed here yet.

## Testing Guidelines

No testing framework or coverage threshold is established. Add tests around enrollment, access decisions, reservations, and overdue-payment workflows. Name tests descriptively, such as `check-in.test.tsx`, and document their execution. Verify keyboard navigation, responsive layouts, visible focus, and reduced-motion behavior. Report measured results separately from unverified accessibility or performance targets.

## Commit & Pull Request Guidelines

No local Git history exists to establish commit conventions. Use concise, imperative commit subjects. Pull requests should explain changes, link applicable requirements or issues, list verification results, and include screenshots for UI changes. Identify simulations, limitations, and pending integrations.

## Security & Configuration

Use fictitious data for payments, health records, biometrics, and tenant fixtures. Keep credentials outside version control. The brief prohibits real charges, real messages, external-service changes, and automatic deployment.
