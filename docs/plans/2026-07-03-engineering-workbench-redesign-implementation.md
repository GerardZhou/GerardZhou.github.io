# Engineering Workbench Redesign Implementation Plan

## Goal

Implement the approved recruiter-first engineering workbench without breaking
the existing GitHub Pages deployment, content safety, accessibility, or
production quality gates.

## Constraints

- Keep React, TypeScript, Vite, and the existing GitHub Actions deployment.
- Preserve accurate, public-safe engineering claims from the current site.
- Do not publish a resume or expose internal employer details.
- Use the supplied portrait only for the approved public portfolio.
- Keep the dependency increase to one motion library at most.
- Keep all essential evidence available outside the interactive workbench.
- Add comments for stateful or non-obvious code so the owner can maintain it.

## Task 1: Establish the Baseline and Prepare the Portrait

Files:

- Read: `package.json`, `pnpm-lock.yaml`, `src/App.tsx`, `src/styles.css`
- Read: `src/portfolioData.ts`, existing components, and tests
- Add: `public/gerard-zhou-headshot.png` or an equivalent optimized asset
- Update: `public/social-card.png` only if the new visual system requires it

Steps:

1. Run the existing lint, test, and production-build commands to capture the
   clean baseline.
2. Inspect the supplied `/Users/gerardzhou/pfp.png` at its original resolution.
3. Create a head-and-upper-shoulders crop that preserves the face, suit, and
   original studio background while removing the lower torso.
4. Export a web-optimized asset with dimensions appropriate for responsive
   hero use and verify sharpness visually.
5. Record the public filename and dimensions in the code guide.

Verification:

- The portrait crop shows the complete head and only upper shoulders/lapels.
- The face is unmodified.
- The file is small enough for an eager hero image without visible degradation.

## Task 2: Extend the Typed Content Layer

Files:

- Modify: `src/portfolioData.ts`
- Modify: `src/portfolioData.test.ts`

Steps:

1. Add typed hero identity, proof-point, interest, and workbench application
   metadata where shared content needs a single source of truth.
2. Add the approved personal interests: hiking, weightlifting, and cooking.
3. Keep competitive programming as a restrained optional analytical interest.
4. Preserve the existing public/private source-code discriminated union.
5. Keep all Oracle descriptions generalized and retain careful language around
   rate limiting and VirusTotal results.
6. Add data-invariant tests for unique application IDs, valid internal anchors,
   reviewed external links, and required evidence references.

Verification:

- No component duplicates mutable portfolio prose.
- No public link points to unavailable or unsafe project code.
- Data tests fail for duplicate IDs or broken internal references.

## Task 3: Build the Pure Window Manager

Files:

- Add: `src/workbench/windowManager.ts`
- Add: `src/workbench/windowManager.test.ts`
- Add: `src/workbench/types.ts`

Steps:

1. Define typed application IDs and window geometry.
2. Implement a pure reducer for open, focus, close, maximize, restore, and move
   actions.
3. Keep a stable z-order without unbounded z-index growth.
4. Clamp window geometry to the desktop viewport and define safe defaults for
   each application.
5. Preserve a window's pre-maximize geometry for restoration.
6. Write deterministic tests for each transition, reopening behavior, focusing
   an existing window, closing the active window, restoring geometry, and all
   boundary clamps.

Verification:

- The reducer has no DOM access or side effects.
- All invalid or stale application actions return a safe state.
- Tests cover edge cases before UI components consume the reducer.

## Task 4: Build the Safe Terminal Model

Files:

- Add: `src/workbench/terminal.ts`
- Add: `src/workbench/terminal.test.ts`

Steps:

1. Define a closed command union and structured output lines.
2. Support `help`, `about`, `projects`, `experience`, `skills`, `lab`,
   `contact`, `github`, `linkedin`, `whoami`, `ls`, and `clear`.
3. Normalize harmless whitespace and casing without evaluating input.
4. Return a local unknown-command message with a `help` suggestion.
5. Keep external actions represented as reviewed application intents rather
   than arbitrary URLs.
6. Test commands, aliases if any, whitespace, unknown input, history clearing,
   and suspicious HTML/script-like text as inert content.

Verification:

- No `eval`, dynamic code generation, shell execution, or raw HTML rendering.
- Terminal output is deterministic and serializable.

## Task 5: Implement Workbench Components

Files:

- Add: `src/workbench/Workbench.tsx`
- Add: `src/workbench/DesktopWindow.tsx`
- Add: `src/workbench/Dock.tsx`
- Add: `src/workbench/TerminalApp.tsx`
- Add: `src/workbench/MobileCommandDeck.tsx`
- Add: `src/workbench/appRegistry.tsx`
- Add: `src/workbench/workbench.css`

Steps:

1. Create a typed application registry that maps IDs to labels, icons, default
   geometry, and content components.
2. Render the System Overview application open by default.
3. Build accessible window chrome with named close and maximize/restore
   controls.
4. Implement focus and stacking through pointer and keyboard interaction.
5. Add constrained dragging with transform-based visual updates and a reducer
   commit at the end of the interaction.
6. Restore focus to the launching dock control when a window closes.
7. Make GitHub and LinkedIn dock items reviewed direct links.
8. Build the terminal UI over the pure parser from Task 4.
9. Build the mobile command deck over the same registry without dragging or a
   miniature desktop.
10. Add explanatory comments around reducer ownership, drag boundaries, focus
    restoration, and the desktop/mobile split.

Verification:

- Dock and window controls work with keyboard-only navigation.
- Pointer dragging cannot move the title bar outside usable bounds.
- Reopening an existing app focuses it instead of duplicating it.
- Mobile panels have a clear close/back affordance and no horizontal overflow.

## Task 6: Redesign the Hero and Page Composition

Files:

- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Reuse or modify: existing components in `src/components/`

Steps:

1. Replace the current hero composition with a recruiter-first identity and
   portrait layout.
2. Keep proof points visible before the workbench.
3. Add an `Open workbench` action that moves focus to the workbench and opens
   the System Overview application when necessary.
4. Place the workbench immediately after the initial recruiter summary.
5. Preserve selected work, systems lab, timeline, capability evidence,
   education, personal interests, and contact below it.
6. Remove redundant copy and keep section transitions concise.
7. Ensure external actions use safe targets and relationship attributes.

Verification:

- A recruiter can identify Gerard, current role, core focus, and top evidence
  without operating the workbench.
- Every workbench content category has an equivalent semantic page section or
  direct link.

## Task 7: Add the Motion System

Files:

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: workbench and page components/styles from Tasks 5 and 6

Steps:

1. Verify the current official React package and API for Motion before adding
   the dependency.
2. Add one pinned/locked maintained motion dependency.
3. Implement short hero, workbench-reveal, window, and section transitions.
4. Use transforms and opacity for animated paths.
5. Route all animation decisions through reduced-motion detection.
6. Avoid animating layout continuously during scroll.

Verification:

- No animation delays clicking, navigation, or reading.
- Reduced-motion mode removes decorative movement and keeps state changes
  obvious.
- The production bundle remains within a reasonable static-portfolio budget.

## Task 8: Update Metadata, Documentation, and Public-Surface Safety

Files:

- Modify: `index.html`
- Modify: `README.md`
- Modify: `CODE_GUIDE.md`
- Review: `public/404.html`, `public/sitemap.xml`, `public/robots.txt`

Steps:

1. Update title, description, social metadata, and structured data for the new
   recruiter-first positioning.
2. Update the code guide with the workbench architecture, terminal command
   registry, portrait replacement workflow, common content edits, tests, and
   deployment instructions.
3. Explain how to replace the profile image safely.
4. Remove obsolete public-facing documentation that suggests publishing a
   resume.
5. Audit source-visible content and the production artifact for private phone
   numbers, internal employer terms, secrets, and unavailable project links.

Verification:

- Metadata is accurate and uses the canonical GitHub Pages URL.
- The code guide is understandable to a developer new to the project.
- The built public surface contains no resume link/file and no private phone
  number.

## Task 9: Run Automated and Manual Quality Gates

Commands:

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm preview`

Steps:

1. Run all automated gates after the reducer/parser work and again after final
   integration.
2. Inspect production HTML and assets for missing paths.
3. Test the production preview at wide desktop, laptop, tablet, and 360-pixel
   mobile widths.
4. Exercise window focus, stacking, move, maximize, restore, close, and reopen.
5. Exercise every terminal command and unknown input.
6. Test keyboard-only navigation and focus restoration.
7. Test reduced motion.
8. Check console errors, broken links, missing images, and horizontal overflow.
9. Run Lighthouse or an equivalent production audit and record the results.
10. Perform the senior-developer self-review for correctness, separation of
    responsibilities, compatibility, security, performance, dependencies,
    tests, documentation, and code quality.

## Task 10: Publish Safely to GitHub Pages

Files:

- Review: `.github/workflows/deploy.yml`

Steps:

1. Confirm the local worktree contains only intended redesign changes.
2. Commit with the repository-local identity.
3. Push through a repository-scoped authentication method without changing
   global Git configuration.
4. Confirm the GitHub Actions validation and deployment jobs pass.
5. Verify the live site serves compiled assets, not raw Vite source.
6. Recheck the live desktop and mobile experience and confirm no console errors.
7. Remove temporary deployment credentials and verify the repository has no
   lingering deploy key.

## Completion Criteria

- The approved recruiter-first hero and interactive workbench are live.
- The portrait is correctly cropped and optimized.
- Desktop and mobile provide intentionally different interaction models.
- Essential evidence is available without operating the desktop.
- All terminal and window behavior is tested and secure.
- Lint, tests, build, accessibility, performance, and browser checks pass.
- The GitHub Pages deployment succeeds with no persistent credential or global
  Git configuration change.
