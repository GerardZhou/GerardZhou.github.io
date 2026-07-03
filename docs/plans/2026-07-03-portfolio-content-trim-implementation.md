# Portfolio Content Trim Implementation Plan

## Objective

Apply the approved content and layout trim without changing unrelated portfolio
behavior or public links.

## 1. Protect the revised content contract

- Update `src/portfolioData.test.ts` to assert the approved Oracle highlight.
- Update `src/workbench/appRegistry.test.ts` and
  `src/workbench/terminal.test.ts` so they assert that the lab app and command no
  longer exist.
- Keep public-link and privacy tests unchanged.

## 2. Remove the queue lab from production code

- Remove `SignalLab` from `src/App.tsx`.
- Delete `src/SignalLab.tsx`, `src/simulation.ts`, and
  `src/simulation.test.ts`.
- Delete all `.signal-lab*` responsive and base rules from `src/styles.css`.
- Remove lab-specific workbench CSS.

## 3. Remove every workbench lab entry point

- Remove `lab` from `WorkbenchAppId` in `src/workbench/types.ts`.
- Remove its registry entry in `src/workbench/appRegistry.ts`.
- Remove the Lab panel and switch branch in
  `src/workbench/WorkbenchAppContent.tsx`.
- Remove the `lab` command and listing entry from
  `src/workbench/terminal.ts`.
- Let the shared dock and mobile command deck update from the reduced registry.

## 4. Apply approved copy and portrait changes

- Replace the Oracle timeline highlight in `src/portfolioData.ts` with the
  approved 45-to-5-minute target wording.
- Keep the longer case-study copy explicitly framed as in progress.
- Remove the header availability element from `src/App.tsx` and its unused CSS.
- Remove workbench availability text from `src/workbench/Workbench.tsx`.
- Simplify the portrait footer in `src/App.tsx` to the approved neutral caption.
- Update portrait CSS to a circular crop while preserving responsive behavior
  and the original image asset.

## 5. Keep section sequencing and documentation coherent

- Renumber Experience, Capability Map, Beyond Code, and Education after the lab
  removal.
- Remove lab references from `README.md` and `CODE_GUIDE.md` while preserving
  useful workbench and deployment instructions.
- Historical design/implementation plans remain unchanged as records of earlier
  decisions.

## 6. Verify and self-review

- Run `npm run lint`, `npm test -- --run`, and `npm run build`.
- Search current production source and built output for removed lab and
  availability labels.
- Preview the production build and inspect desktop and mobile layouts.
- Confirm the circular portrait, reduced dock, updated copy, and section order.
- Review the diff for unrelated changes, dead imports, broken anchors, privacy
  regressions, and dependency changes.

