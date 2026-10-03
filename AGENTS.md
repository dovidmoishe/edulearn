# EduLearn workspace

This repository contains four independently deployed projects at the root:

- `web/`: student Next.js app; development port 3000
- `admin/`: admin Next.js app; development port 3002
- `edulearnapi/`: NestJS/Fastify API; default port 3001
- `mobile/`: Expo SDK 55 / React Native app; Metro's default port 8081

Keep components, types, interfaces, and configuration inside their owning project.
Do not introduce `apps/`, shared UI packages, or shared contracts without an explicit request.

## Workspace commands

Use pnpm 11.22.0 and Node.js 24 (see `package.json` and `.nvmrc`).
Install from the repository root with `pnpm install --frozen-lockfile`.
The root `pnpm-lock.yaml` and `pnpm-workspace.yaml` are authoritative.
Do not create nested workspace files, npm lockfiles, or project-local pnpm lockfiles.
Add dependencies to their owning project with `pnpm --filter <name> add <dependency>`.
Use `web`, `admin`, `edulearn-api`, or `mobile` as the package filter.
Keep framework and React versions project-specific; do not enforce one React version globally.

Use root scripts (`dev:web`, `dev:admin`, `dev:api`, `dev:mobile`, `build`, `lint`,
`typecheck`, `test`) or filtered commands for the affected project.
`pnpm build` builds web, admin, and API. Mobile exports and native builds are separate.
Run relevant checks and report existing failures; do not fix unrelated application code.
Keep API lint checks read-only; use `lint:fix` only when intentionally changing formatting.
Database migrations, seeders, and cleanup scripts are explicit operations, never build steps.
Keep credentials in each project's environment files, outside Git.
Admin requires `SESSION_SECRET` (32+ characters) during builds and at runtime.

## Deployment

Deploy each project independently from this single repository.
Use the root lockfile during installation; see `docs/deployment.md`.
Next.js apps emit standalone server artifacts when `NEXT_STANDALONE=1` is set
at build time. Normal local builds use standard Next.js output.
Run EAS commands from `mobile/`.
Do not deploy, publish, push, or change existing production projects without authorization.

## Git and commits

Use the root Git repository. The original Git repositories are backed up locally in
the ignored `.repo-backups/git/` directory, and their refs are under `refs/archive/`.
Do not remove these backups or rewrite imported histories.

Always use Conventional Commit messages: `type(scope): description`.
Use lowercase types: feat, fix, refactor, perf, style, docs, test, build, ci, chore.
Always include a meaningful scope: `web` for frontend, `api` for backend, and
`repo`, `deps`, or `ci` for shared tooling.
Write concise, lowercase, imperative descriptions explaining the actual change,
with no trailing period. Use `style` only for formatting changes.
Keep each commit focused on one logical change.
