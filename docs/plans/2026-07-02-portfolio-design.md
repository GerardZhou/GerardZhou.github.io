# Gerard Zhou Portfolio Design

## Objective

Build a fast, credible, and memorable personal portfolio for Gerard Zhou's
2027 quantitative engineering, quantitative research, and big-tech software
engineering internship applications. The site must make Gerard's strongest
evidence understandable within 30 seconds while rewarding deeper technical
review.

The public site will be prepared for the `GerardZhou.github.io` repository and
served at `https://gerardzhou.github.io`.

## Positioning

Present one coherent identity: a UT Austin computer science student who builds
reliable systems for consequential, data-intensive work. Systems engineering,
infrastructure, and measurable impact are the demonstrated core. Quantitative
readiness is communicated through analytical rigor, probability and linear
algebra coursework, precise reasoning, and an interactive technical lab - not
through unsupported finance claims.

The public narrative will emphasize:

- production-minded engineering at Oracle Cloud Infrastructure and IBM;
- Go, Python, C++, cloud infrastructure, Kubernetes, testing, and reliability;
- measurable results, including a 45-minute manual workflow targeted for
  automation and more than 70% less configuration effort;
- user-facing impact from Soapbox, MobilizeUT, and QRmor; and
- intellectual honesty about ownership, constraints, and private work.

## Experience Design

Use a premium editorial interface that resembles a precise analytical
instrument rather than a generic developer template. The visual system uses a
deep ink background, warm paper foregrounds, restrained electric-cyan and
UT-burnt-orange accents, a display serif for major statements, a neutral sans
for reading, and monospaced labels and metrics. Fine grid lines, calibrated
spacing, and subtle signal motion create technical character without neon
glass, particles, custom cursors, or scroll hijacking.

The first viewport contains Gerard's name, current role and university,
positioning statement, recruiting availability, résumé/GitHub/contact actions,
and an interactive evidence panel. It must be fully understandable without
interaction and remain polished with JavaScript or motion disabled.

## Information Architecture

1. **Hero** - identity, positioning, availability, and primary actions.
2. **Evidence strip** - four verified proof points for fast recruiter scanning.
3. **Selected work** - Oracle/IBM systems work and the strongest public
   projects, each framed as challenge, approach, and result.
4. **Systems signal lab** - a small deterministic, educational simulation that
   explores reliability/latency tradeoffs and demonstrates analytical thinking.
   It is explicitly labeled as an interactive portfolio lab, not work history.
5. **Experience timeline** - concise chronology with public-safe descriptions.
6. **Capability map** - skills linked to concrete evidence instead of a keyword
   cloud.
7. **Education and contact** - UT Austin details, coursework, and clear links.

Important content is visible in the static document. Filters and expandable
details enhance discovery but never hide essential evidence from recruiters,
search engines, keyboard users, or reduced-motion users.

## Content Safety

- Omit the résumé phone number from the public site.
- Publish the résumé email as an explicit `mailto:` action because the user
  supplied it for recruiting use; document how to replace it later.
- Generalize Oracle-specific internal names to release orchestration,
  infrastructure-as-code, and isolated test environments.
- Include no private source, diagrams, screenshots, credentials, customer data,
  or internal implementation details.
- Describe rate limiting as mitigating abusive traffic, not preventing DDoS.
- Describe VirusTotal findings as "no threats detected," not proof of safety.
- Attribute organization-level metrics carefully and distinguish "built for"
  from active usage.

## Architecture

Use a static TypeScript/React site built with Vite. Static assets and all core
content are bundled at build time so GitHub Pages needs no server, database,
runtime secret, or third-party content API. Site data lives in typed local
modules and reusable presentation components. Interactive components remain
small and deterministic.

GitHub Actions builds and publishes the generated `dist` directory. Asset paths
are compatible with the root user-site URL. The repository includes a custom
404 page, sitemap, robots file, social metadata, structured data, favicon, and
a recruiter-friendly résumé download.

## Interaction and Failure Behavior

- Navigation, external links, and résumé access work without client state.
- The signal lab validates controls, clamps inputs, uses seeded calculations,
  and provides a text/table interpretation of the visualization.
- If clipboard or share APIs are unavailable, ordinary links remain usable.
- Motion respects `prefers-reduced-motion`; all controls have visible focus and
  keyboard behavior.
- No live GitHub API calls are made, avoiding rate limits, content drift, and
  recruiter-facing failures.

## Quality Targets

- Semantic HTML and WCAG 2.2 AA contrast and keyboard behavior.
- Responsive layout from 360px mobile through wide desktop.
- Lighthouse performance and accessibility targets of at least 95 when tested
  in a production build under normal local conditions.
- Core Web Vitals targets: LCP at or below 2.5s, INP at or below 200ms, and CLS
  at or below 0.1.
- No console errors, broken internal links, missing metadata, layout overflow,
  or inaccessible motion-only content.

## Verification

Run formatting/linting, type checks, unit tests for data and simulation logic,
and a production build. Open the local production-equivalent preview early,
then verify desktop and mobile layouts, keyboard navigation, reduced motion,
external links, résumé download, and the GitHub Pages artifact. Perform a final
content audit against the supplied résumé and public repositories before
publishing.

## Approved Direction

The user approved the recommended evidence-first editorial portfolio with a
restrained interactive technical visualization on July 2, 2026.
