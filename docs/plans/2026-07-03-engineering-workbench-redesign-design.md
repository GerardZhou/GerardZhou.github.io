# Engineering Workbench Portfolio Redesign

## Objective

Redesign Gerard Zhou's GitHub Pages portfolio into a memorable, recruiter-first
engineering experience for big-tech, infrastructure, systems, and quantitative
engineering internship applications. The site should communicate credible
engineering depth within seconds, then reward exploration through a polished
interactive MacBook workbench.

The redesign must make visitors think "strong engineer" before "frontend
designer." Interaction and motion support the evidence; they never conceal or
delay it.

## Approved Direction

The approved direction is a recruiter-first engineering workbench:

1. A conventional, immediately legible hero establishes Gerard's identity,
   positioning, strongest evidence, and contact actions.
2. A premium MacBook workbench becomes the memorable interactive centerpiece
   immediately below the initial recruiter summary.
3. Semantic scrolling sections preserve full access to the strongest evidence
   without requiring visitors to operate the simulated desktop.

The site will not contain, link, mention, simulate, or publish a resume. This
includes navigation, desktop applications, terminal commands, metadata, and
documentation presented to site visitors.

## Positioning

Present Gerard as a UT Austin computer science student and software engineer
who works across cloud infrastructure, Kubernetes automation, backend systems,
mobile products, and software reliability. Quantitative readiness is supported
by analytical coursework and an interactive reliability lab, not unsupported
finance claims.

Primary evidence:

- Oracle Cloud Infrastructure release automation and test isolation;
- an IBM Kubernetes operator that reduced configuration effort by more than
  70%;
- more than 20 backend endpoints for Soapbox's volunteer platform;
- testing and static-analysis work across production Python services at TRUCE;
- accessible routing work in MobilizeUT; and
- QRmor's QR destination review flow.

Internal employer names and implementation details remain generalized. The
portfolio must not expose private code, diagrams, credentials, customer data,
or unreleased product information.

## Information Architecture

### 1. Recruiter Hero

The opening viewport contains:

- Gerard's name, UT Austin affiliation, and current OCI role;
- a concise systems/backend/infrastructure positioning statement;
- four measurable proof points;
- GitHub, LinkedIn, email, and "Open workbench" actions; and
- a cropped professional head-and-shoulders portrait.

The hero is usable immediately. There is no blocking boot sequence, typing
animation, or intro screen.

### 2. Interactive MacBook Workbench

The workbench appears through a short hinge/reveal transition as it enters the
viewport. A useful System Overview window is open by default so visitors never
face an unexplained empty desktop.

The dock contains:

- About;
- Selected Work;
- Experience;
- Systems Lab;
- Skills;
- Terminal;
- Contact;
- GitHub; and
- LinkedIn.

Internal applications open native-feeling windows. GitHub and LinkedIn remain
direct external actions. Windows support opening, closing, focusing, layering,
maximizing, restoring, and pointer dragging within safe desktop bounds.

### 3. Recruiter-Readable Evidence

The workbench is followed by normal semantic sections:

- selected engineering work;
- the interactive queue/reliability lab;
- chronological experience;
- capabilities tied to evidence;
- UT Austin education;
- a restrained personal note covering hiking, weightlifting, and cooking; and
- contact actions.

Competitive programming may appear as a small analytical-interest signal.
High-school debate and Science Olympiad results are omitted because Gerard's
current engineering evidence is stronger and more relevant.

## Visual System

The palette uses near-black and graphite surfaces, cool blue-gray depth, and
one restrained electric-blue/cyan accent. Fine grid details, soft shadows, and
sparse glass effects create technical character without visual clutter.

Typography combines a modern neutral sans-serif for reading with a monospaced
engineering layer for commands, labels, and metrics. The design may use locally
served or system font stacks, but it must not introduce a blocking runtime font
dependency.

The MacBook is a CSS-rendered hardware frame inspired by premium industrial
design without reproducing Apple logos or proprietary interface assets. The
desktop uses an original technical wallpaper and custom application icons.

## Portrait Treatment

Use `/Users/gerardzhou/pfp.png` as the source during implementation. Produce an
optimized public image cropped around Gerard's head and upper shoulders/lapels,
removing the lower torso while preserving the original face, clothing, and
studio background. Do not generate or retouch facial features.

Use the portrait prominently but professionally in the hero and as a smaller
asset in the About application. Export responsive web formats and sizes, keep a
high-quality fallback, and provide meaningful alternative text.

## Motion System

Motion is short, purposeful, and interruptible:

- a subtle hero reveal;
- a workbench hinge/reveal transition on entry;
- spring-based window open, focus, maximize, and restore transitions;
- quiet hover depth on project surfaces; and
- restrained timeline and section reveals.

No animation delays access to content. Avoid scroll hijacking, autoplayed
typing, excessive particles, custom cursors, and long boot sequences. All
motion has a reduced-motion equivalent that removes transforms and decorative
transitions while preserving state changes.

## Application Architecture

Keep the existing React, TypeScript, and Vite foundation. It is already
compatible with the static GitHub Pages deployment and avoids a framework
migration that would not improve this static product.

The implementation uses:

- the existing typed local content layer as the source of truth;
- a typed application registry for workbench applications;
- a pure window-manager reducer for open, focus, close, maximize, restore,
  position, and stacking state;
- presentational window components that do not own global desktop state;
- a pure, allowlisted terminal parser with no `eval`, shell execution, or
  arbitrary URL handling; and
- shared content selectors so workbench applications and semantic sections do
  not drift apart.

Use existing dependencies where practical. Add at most one maintained motion
dependency if it materially improves accessible spring and drag behavior.

## Terminal Design

Supported commands should include:

- `help`;
- `about`;
- `projects`;
- `experience`;
- `skills`;
- `lab`;
- `contact`;
- `github`;
- `linkedin`;
- `whoami`;
- `ls`; and
- `clear`.

Unknown commands produce a concise local error and a suggestion to run `help`.
No command accepts arbitrary executable input. Resume-related commands are not
implemented and are not listed.

## Mobile Experience

Mobile is not a scaled-down desktop. The hero uses a compact portrait and
single-column evidence flow. The workbench becomes a touch-first command deck:
application cards or a bottom app bar open accessible full-screen panels. There
is no tiny laptop frame, constrained drag interaction, or hover-only feature.

The same content, application registry, and terminal output model are reused,
while layout and interaction controls are adapted for touch. The minimum target
size is 44 by 44 CSS pixels, and the page must not create horizontal overflow at
360 pixels.

## Accessibility and Failure Behavior

- Use semantic landmarks, headings, lists, buttons, and links.
- Provide visible focus states and logical tab order.
- Restore focus to the launcher that opened a window after it closes.
- Give every window an accessible name and every control a specific label.
- Do not make pointer dragging the only way to use or understand a window.
- Keep all critical evidence in the document outside the workbench.
- Respect `prefers-reduced-motion`.
- If an image fails, preserve readable identity text and alternative text.
- If motion or advanced CSS is unavailable, render a stable static workbench.
- Use ordinary links when clipboard APIs are unavailable.

The portfolio has no runtime API, analytics, tracker, database, authentication,
or third-party contact backend. Contact uses direct email and copy-email
actions, preventing form-delivery failures and unnecessary data collection.

## Performance and Security

- Keep the initial bundle small and avoid heavyweight desktop/UI frameworks.
- Lazy-load noncritical workbench applications and the analytical lab where it
  produces a real loading benefit.
- Serve appropriately sized portrait and project media in modern formats.
- Animate transforms and opacity instead of layout-heavy properties.
- Constrain pointer coordinates and window geometry before applying them.
- Treat terminal input as plain text and render it through React escaping.
- Use safe external-link attributes and fixed, reviewed destinations.
- Make no live GitHub requests, avoiding rate limits and public-client tokens.
- Preserve the existing least-privilege GitHub Pages deployment workflow.

## Testing and Verification

Add deterministic unit tests for:

- every window-manager transition and boundary case;
- terminal command parsing, aliases, unknown commands, and clearing history;
- application registry and portfolio-data invariants; and
- any updated analytical-model behavior.

Run linting, type checking, unit tests, and a production build before browser
review. Verify the production preview on desktop and mobile, including:

- window launch, focus, stacking, maximize, restore, close, and constrained
  dragging;
- terminal keyboard behavior;
- external and internal links;
- keyboard-only navigation and focus restoration;
- reduced motion;
- portrait loading and responsive cropping;
- no horizontal overflow;
- no console errors; and
- no resume references in source-visible content or the built artifact.

Target at least 95 for Lighthouse performance, accessibility, best practices,
and SEO in the production build. Treat 100 as an aspirational outcome rather
than a reason to compromise the experience or report an unverifiable result.

## Deployment

Continue deploying the compiled Vite `dist` artifact through the existing
GitHub Actions workflow to `GerardZhou.github.io`. Keep GitHub Pages configured
to use GitHub Actions, not the raw `main` branch. Publishing occurs only after
all validation and visual checks pass.

## Approval Record

Gerard approved the recruiter-first engineering workbench, information
architecture, visual system, portrait treatment, interaction model, mobile
adaptation, and quality strategy on July 3, 2026.
