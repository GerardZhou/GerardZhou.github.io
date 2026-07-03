# Portfolio Implementation Plan

## Goal

Deliver a static, production-quality React portfolio for
`GerardZhou.github.io` that turns the approved evidence-first design into a
fast recruiter experience and can be published with GitHub Pages.

## Build Plan

### 1. Establish the project foundation

- Create a Vite, React, and TypeScript project optimized for static output.
- Add formatting, linting, type-checking, and deterministic unit-test scripts.
- Copy the supplied résumé into a public recruiting-safe filename.
- Model résumé-derived content in typed local data structures.

### 2. Build the first recruiter-facing slice

- Implement global typography, color, layout, and accessibility foundations.
- Build the navigation, hero, primary actions, and verified proof strip.
- Start the local server and open the first meaningful preview.

### 3. Complete the evidence experience

- Add selected experience and project case-study cards.
- Add the chronological experience and capability-evidence sections.
- Keep descriptions public-safe and distinguish public code from private work.

### 4. Add the systems signal lab

- Implement a seeded queue/reliability simulation with validated controls.
- Visualize throughput, tail latency, and failure tradeoffs in accessible SVG.
- Include a concise methodology, limitations, and tabular text alternative.
- Unit test deterministic calculations, clamping, and edge conditions.

### 5. Refine the interface

- Add restrained reveal, hover, focus, and chart transitions.
- Support reduced motion, light/dark preference, keyboard navigation, and
  narrow mobile layouts.
- Prevent overflow and preserve an immediate 30-second recruiter scan path.

### 6. Prepare GitHub Pages publishing

- Add favicon, social preview, canonical metadata, JSON-LD, sitemap, robots,
  and a custom 404 page.
- Add a GitHub Actions Pages workflow and repository instructions.
- Configure root paths for the `GerardZhou.github.io` user site.

### 7. Verify and publish

- Run tests, lint, type checks, and a production build.
- Audit public claims against the résumé and current public repositories.
- Self-review accessibility, security, performance, dependencies, and content.
- Commit the finished site, create/connect the GitHub repository, push `main`,
  and verify the Pages deployment when account authentication permits.

## Deliberate Constraints

- No server, database, secrets, analytics tracker, or live GitHub API request.
- No phone number or confidential employer material.
- No unverified finance experience or performance claims.
- No heavyweight animation or visualization dependency.
- No beginner or tutorial repositories featured.
