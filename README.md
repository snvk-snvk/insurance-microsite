This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

The app is deployed on both **Vercel** and **Render.com**, running the same codebase against a
shared **Vercel Blob** logo store.

### Vercel

The [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

### Render.com

Configured via [`render.yaml`](./render.yaml) (a Render Blueprint) — a Node web service built with
`npm ci && npm run build` (plus copying static assets into the Next.js `standalone` output) and run
via `node .next/standalone/server.js`, which binds to Render's injected `$PORT`.

Required environment variable (set in the Render dashboard):

- `BLOB_READ_WRITE_TOKEN` — the **same** Vercel Blob read/write token the Vercel project uses, so
  both hosts read/write the same logo store. Find it in the Vercel project's Blob store settings.

`NODE_VERSION` is pinned to 22 in `render.yaml`; the `engines` field in `package.json` enforces
Node ≥ 20.9 required by Next.js 16.

## Versioned deployments (staging / v2)

To try UI changes **without touching the live production URLs**, work happens on a long-lived
`staging` branch that deploys to its own separate URLs. `main` is always production.

| Branch | Environment | Vercel | Render |
|--------|-------------|--------|--------|
| `main` | production | production domain | `insurance-microsite.onrender.com` |
| `staging` | staging / v2 | `…-git-staging-<scope>.vercel.app` (stable branch alias) | `insurance-microsite-staging.onrender.com` |

Both environments run the same code and share the same Vercel Blob store.

**Workflow**

1. `git switch staging`, make UI edits, `git push`. Both staging URLs rebuild automatically.
2. Review on the staging URLs — production URLs keep serving the old UI.
3. When approved: `git switch main && git merge staging && git push` → production updates.
4. Keep `staging` around for the next change; occasionally `git merge main` into it to stay current.

**One-time setup**

- _Render_ — after `render.yaml` is on `main`, **Sync** the Blueprint in the Render dashboard; it
  creates the `insurance-microsite-staging` service (defined in `render.yaml`, pinned to the
  `staging` branch). Set its `BLOB_READ_WRITE_TOKEN` (same token as production).
- _Vercel_ — connect the GitHub repo under **Project → Settings → Git** so branch pushes auto-deploy;
  `staging` then gets the stable branch-alias URL above. Add `BLOB_READ_WRITE_TOKEN` to the
  **Preview** environment scope, or staging's logo upload API will fail.
