# EduLearn

One repository and pnpm workspace, with four independently deployed projects:

```text
edulearnv2/
  web/           Student web app (Next.js)
  admin/         Admin dashboard (Next.js)
  edulearnapi/   Backend (NestJS / Fastify)
  mobile/        Mobile app (Expo / React Native)
```

Each project owns its dependencies, components, types, environment files, and
framework configuration. There are no shared UI or contracts packages.

## Setup

Use Node.js 24 and pnpm 11.22.0. Install once from the repository root:

```sh
pnpm install --frozen-lockfile
```

Configure environment variables inside each project. API, admin, and mobile include
`.env.example` files; web has its existing project setup instructions.
Local `.env` files remain ignored.
Admin requires a unique `SESSION_SECRET` of at least 32 characters during builds
and at runtime; copy `admin/.env.example` to `admin/.env.local` and configure it.

## Development

```sh
pnpm dev:web       # http://localhost:3000
pnpm dev:api       # http://localhost:3001 (unless PORT overrides it)
pnpm dev:admin     # http://localhost:3002
pnpm dev:mobile    # Expo / Metro on port 8081
```

`pnpm dev` runs all four development tasks through Turborepo. For mobile's
interactive Expo terminal, run `pnpm dev:mobile` separately. After migrating an
existing checkout, run `pnpm dev:mobile --clear` once to clear Metro's old cache.

For a physical mobile device, its API URL must point at a reachable host or your
computer's LAN address; the device's `localhost` is not your computer.

## Builds and checks

```sh
pnpm build             # Web, admin, and API
pnpm build:web
pnpm build:admin
pnpm build:api
pnpm export:mobile     # Expo export; separate from native builds
pnpm android           # Local Android build
pnpm ios               # Local iOS build (macOS required)
pnpm lint
pnpm typecheck
pnpm test              # Existing API Jest suite
```

Run project checks directly when working on just one project:

```sh
pnpm --filter mobile typecheck
pnpm --filter edulearn-api test -- --runInBand
```

Build caching is disabled while build-time environment variables and remote
inputs remain project-specific. Turborepo still coordinates builds and caches
read-only lint tasks. Development, typechecking, and tests are not cached.

The migration was verified with frozen lockfile checks, web and API production
builds, an admin production build using a temporary process-only `SESSION_SECRET`,
all three server/web typechecks, mobile's Android JavaScript export and lint,
and 31 existing API tests. Mobile still has 16 source type errors; web, admin,
and API lint checks report existing application and formatting issues.
Native mobile builds and Linux standalone packaging have not been executed.

## Dependencies and mobile

The root workspace uses isolated dependencies so each project resolves its own
React and framework versions. Expo's default Metro configuration handles the
workspace; the existing package-exports compatibility setting remains in place.
Metro excludes sibling app folders, local stores, and migration backups from its
file scan, while retaining root dependency resolution.
Mobile's worklets override lives in the root workspace configuration. Its Babel
preset is declared directly rather than relying on npm hoisting.

```sh
pnpm --filter web add <dependency>
pnpm --filter admin add <dependency>
pnpm --filter edulearn-api add <dependency>
pnpm --filter mobile exec expo install <dependency> --pnpm
```

Commit the owning project's `package.json` and the root `pnpm-lock.yaml` together.
Dependency build scripts require explicit entries in `allowBuilds` in the root
workspace configuration; do not broadly enable every dependency's build scripts.

## Deployment and repository history

See [deployment guidance](docs/deployment.md) for filtered installation, standalone
Next.js output, API packaging, and EAS builds. Set `NEXT_STANDALONE=1` when
building a Next.js app for a standalone deployment artifact; normal local builds
use Next.js's standard output.

The root `main` branch imports the checked-out heads of all four original
repositories without rewriting their commits. The source web checkout was on
`feature/web3-hero-store-ctas`; admin was on `master`; API and mobile were on `main`.
Other original refs are preserved under `refs/archive/<project>/`:

```sh
git log refs/archive/web/heads/feature/web3-hero-store-ctas
git for-each-ref refs/archive/
```

Complete original Git directories and pre-migration lockfiles are also preserved
in the ignored local `.repo-backups/` folder. That folder is not uploaded in a
normal clone or push. The imported current histories are reachable from `main`;
archived refs require explicit publication if they are needed on another machine.

The new root repository intentionally has no remote yet. Choose a new monorepo
remote instead of pushing this combined tree into an existing app repository.
