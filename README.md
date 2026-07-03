# Gerard Zhou — Portfolio

[![Deploy portfolio to GitHub Pages](https://github.com/GerardZhou/GerardZhou.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/GerardZhou/GerardZhou.github.io/actions/workflows/deploy.yml)

A fast, evidence-first portfolio for Gerard Zhou's software engineering and quantitative internship applications. The site presents production systems work, measurable outcomes, selected projects, and an interactive systems lab in a recruiter-friendly static experience.

**Live site:** [gerardzhou.github.io](https://gerardzhou.github.io/)

New to the codebase? Start with [`CODE_GUIDE.md`](CODE_GUIDE.md) for a plain-language tour of the files, React data flow, common edits, and deployment process.

## Built for a quick, credible review

- Verified impact is visible before interaction or scrolling deeply.
- Experience and projects connect technical choices to outcomes.
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

Everything in `public/` and everything rendered by the app becomes publicly accessible after deployment. Review contact details, project descriptions, images, and documents before every public update.

**A résumé is not currently included, linked, or published.** This is intentional: adding one is an explicit opt-in so a private or outdated document cannot be deployed by accident.

The published site deliberately:

- excludes a phone number from page content;
- excludes a résumé file and résumé link;
- generalizes confidential employer implementation details;
- makes no background API requests to GitHub, LinkedIn, or employer systems; and
- contains no analytics, behavioral tracking, or application-set cookies.

External links are governed by their destination's privacy policies.

Project descriptions and metrics should remain accurate, attributable, and safe for public disclosure. Private source code, internal diagrams, credentials, customer data, and unreleased employer details do not belong in this repository.

## Optional: add a résumé later

Only follow these steps after reviewing the exact PDF you want to make public:

1. Remove private details you do not want indexed or downloaded, including phone numbers, addresses, document metadata, and confidential employer information.
2. Name the reviewed file `Gerard-Zhou-Resume.pdf` and place it at `public/Gerard-Zhou-Resume.pdf`. Files in `public/` are copied directly into the deployed site.
3. In `src/portfolioData.ts`, add `"resume"` to `ExternalLinkId`, add `"document"` to the `ExternalLink` `kind` union, and add this entry to `externalLinks`:

   ```ts
   {
     id: "resume",
     label: "Résumé",
     href: "/Gerard-Zhou-Resume.pdf",
     kind: "document",
   },
   ```

   `EducationContact` already renders every item in `externalLinks`, so this creates a link in the contact section. If you also want a header button, add a `resume` lookup to `linkById` in `src/App.tsx` and render a link beside the availability message.
4. Run `pnpm lint`, `pnpm test`, and `pnpm build`.
5. Open `dist/Gerard-Zhou-Resume.pdf` locally and click the website link from `pnpm preview` before committing.
6. Run `git status --short` and confirm that the only new document is the reviewed public PDF.

To remove it again, delete the PDF, remove the data entry and any manually added header link, then rebuild. The expanded walkthrough in [`CODE_GUIDE.md`](CODE_GUIDE.md#adding-a-r%C3%A9sum%C3%A9-later-opt-in) explains why each step is needed.

## Canonical publishing details

- Canonical origin: `https://gerardzhou.github.io`
- Sitemap: `https://gerardzhou.github.io/sitemap.xml`
- Robots policy: `https://gerardzhou.github.io/robots.txt`
- Deployment source: `main` via `.github/workflows/deploy.yml`

© Gerard Zhou. Portfolio content and personal materials are not licensed for reuse.
