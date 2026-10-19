# EduLearn workspace

This repository contains four independently deployed projects under `apps/`:

- `apps/web/`: student Next.js app; development port 3000
- `apps/admin/`: admin Next.js app; development port 3002
- `apps/api/`: NestJS/Fastify API; default port 3001
- `apps/mobile/`: Expo SDK 55 / React Native app; Metro's default port 8081

Keep components, types, interfaces, and configuration inside their owning project.
Do not introduce shared UI packages or shared contracts without an explicit request.

## Workspace commands

Use pnpm 11.22.0 and Node.js 24 (see `package.json` and `.nvmrc`).
Install from the repository root with `pnpm install --frozen-lockfile`.
The root `pnpm-lock.yaml` and `pnpm-workspace.yaml` are authoritative.
Do not create nested workspace files, npm lockfiles, or project-local pnpm lockfiles.
Add dependencies to their owning project with `pnpm --filter <name> add <dependency>`.
Use `web`, `admin`, `api`, or `mobile` as the package filter.
Keep framework and React versions project-specific; do not enforce one React version globally.

Use root scripts (`dev:web`, `dev:admin`, `dev:api`, `dev:mobile`, `build`, `lint`,
`typecheck`, `test`) or filtered commands for the affected project.
`pnpm build` builds web, admin, and API. Mobile exports and native builds are separate.
Run relevant checks and report existing failures; do not fix unrelated application code.
Keep API lint checks read-only; use `lint:fix` only when intentionally changing formatting.
Database migrations, seeders, and cleanup scripts are explicit operations, never build steps.
Keep credentials in each project's environment files, outside Git.
Admin requires `SESSION_SECRET` (32+ characters) during builds and at runtime.

## Feature buildboards

Before starting any new feature, create a local HTML buildboard at
`.buildboards/<feature-slug>.html`. Reuse that board for all subsequent work on
the same feature. Keep it self-contained and readable in a browser.

Track every phase of the feature build and rollout, including planning,
implementation, validation, rollout preparation, deployment, and post-rollout
verification. Include phase tasks, their statuses (`not started`, `in progress`,
`blocked`, or `complete`), completion criteria, and the next action. Mark phases
that do not apply explicitly, with a reason.

At the start of every agent turn working on that feature, read its buildboard to
establish the current progress, blockers, and next steps before doing feature
work. If the board is missing, create it from the available context first.
Before ending each turn, update the statuses of the tasks worked on and append
dated comments or logs covering changes, decisions, validation results, blockers,
and remaining work. Keep pending rollout steps visible until they are verified;
the buildboard does not authorize deployment or publication.

Buildboards and their supporting files must remain local and untracked. Keep
them inside the ignored `.buildboards/` directory; never stage, force-add,
commit, or push them into Git history.

## Deployment

Deploy each project independently from this single repository.
Use the root lockfile during installation.
Next.js apps emit standalone server artifacts when `NEXT_STANDALONE=1` is set
at build time. Normal local builds use standard Next.js output.
Run EAS commands from `apps/mobile/`.
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
