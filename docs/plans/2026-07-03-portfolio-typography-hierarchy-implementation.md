# Portfolio Typography and Hierarchy Implementation Plan

## 1. Protect revised content

- Update `src/portfolioData.test.ts` to assert the approved Soapbox title.
- Keep existing privacy, link, identifier, and evidence-anchor tests unchanged.

## 2. Simplify section language

- Update `src/components/FeaturedWork.tsx` to use “Experience & Projects.”
- Update `src/components/CapabilityMap.tsx` to use “Technical Skills,” remove
  the abstract description, and render skill pills before supporting prose.
- Update the personal paragraph in `src/App.tsx`.
- Update the Soapbox title in `src/portfolioData.ts`.

## 3. Rebalance typography

- Increase `.work-card-topline`, `.work-kind`, and `.work-organization` sizing
  and add a clear visual separator between type and organization.
- Reduce shared `.section-heading h2` sizing.
- Reduce `.work-card h3`, experience company headings, capability-card
  headings, and other oversized below-the-fold headings proportionally.
- Tighten capability-card height and spacing so technology pills appear sooner.
- Adjust mobile overrides so they do not restore the previous oversized values.

## 4. Verify

- Run lint, the complete test suite, and the production build.
- Search for superseded headings and copy in production source/build output.
- Inspect desktop and 390px mobile layouts for wrapping and horizontal overflow.
- Confirm skill pills are visible immediately below the Technical Skills heading.
- Review the diff for unrelated layout, navigation, privacy, dependency, or
  content changes.

