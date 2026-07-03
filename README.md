# Gerard Zhou — Portfolio

[![Deploy portfolio to GitHub Pages](https://github.com/GerardZhou/GerardZhou.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/GerardZhou/GerardZhou.github.io/actions/workflows/deploy.yml)

A recruiter-first software engineering portfolio with an interactive MacBook workbench, production systems evidence, and measurable outcomes.

**Live site:** [gerardzhou.github.io](https://gerardzhou.github.io/)

New to the codebase? Start with [`CODE_GUIDE.md`](CODE_GUIDE.md) for a plain-language tour of the files, React data flow, common edits, and deployment process.

## Built for a quick, credible review

- Verified impact is visible before interaction or scrolling deeply.
- The desktop workbench opens typed applications, manages layered windows, and includes a safe local terminal.
- Experience and projects connect technical choices to outcomes.
- Mobile uses a dedicated touch-first command deck instead of shrinking the desktop.
- The interface is semantic, keyboard accessible, responsive, and reduced-motion aware.
- Core content is bundled locally—there is no runtime API, database, analytics tracker, or secret.
- GitHub Pages serves a static Vite build with a custom 404, sitemap, and crawler rules.

## Technology

React 19, TypeScript, Vite, Vitest, and hand-authored CSS. The project intentionally avoids a component framework and heavyweight animation or charting dependencies.

## Local development

Requirements:

- Node.js 22.13 or newer
- Corepack (included with supported Node.js 22 installations)

```bash
corepack enable pnpm
corepack install --global pnpm@11.7.0
pnpm install --frozen-lockfile
pnpm dev
```

Vite prints the local development URL. Before publishing, run the same validation used by the deployment workflow:

```bash
pnpm lint
pnpm test
pnpm build
pnpm preview
```

The production output is written to `dist/` and should not be committed.

## Deploying to `GerardZhou.github.io`

1. Create a public repository named `GerardZhou.github.io` under the `GerardZhou` account.
2. Push this project to its `main` branch.
3. In **Settings → Pages**, select **GitHub Actions** as the source if GitHub has not selected it automatically.
4. Open the **Actions** tab and confirm that **Deploy portfolio to GitHub Pages** completes.
5. Visit [https://gerardzhou.github.io/](https://gerardzhou.github.io/). GitHub may take a few minutes to provision the first deployment and HTTPS certificate.

Every push to `main` runs linting, tests, and a production build before publishing. The workflow uses a frozen pnpm lockfile, read-only source permissions during the build, short timeouts, and GitHub's OIDC-backed `github-pages` environment for deployment. It requires no repository secrets.

## Content and privacy

Everything in `public/` and everything rendered by the app becomes publicly accessible after deployment. Review contact details, project descriptions, and images before every public update.

The published site deliberately:

- excludes a phone number from page content;
- generalizes confidential employer implementation details;
- makes no background API requests to GitHub, LinkedIn, or employer systems; and
- contains no analytics, behavioral tracking, or application-set cookies.

External links are governed by their destination's privacy policies.

Project descriptions and metrics should remain accurate, attributable, and safe for public disclosure. Private source code, internal diagrams, credentials, customer data, and unreleased employer details do not belong in this repository.

## Canonical publishing details

- Canonical origin: `https://gerardzhou.github.io`
- Sitemap: `https://gerardzhou.github.io/sitemap.xml`
- Robots policy: `https://gerardzhou.github.io/robots.txt`
- Deployment source: `main` via `.github/workflows/deploy.yml`

© Gerard Zhou. Portfolio content and personal materials are not licensed for reuse.
