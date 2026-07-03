# Portfolio Typography and Hierarchy Design

## Goal

Make the portfolio easier to scan by reducing oversized below-the-fold headings,
making experience/project labels more prominent, and turning the capability map
into an immediately recognizable technical-skills section.

## Experience and projects

- Rename the section title from “Work that holds up under scrutiny.” to
  “Experience & Projects.”
- Keep a short description explaining that entries connect decisions to
  outcomes.
- Increase the size and visual weight of the work type and organization labels,
  such as “EXPERIENCE | IBM” and “PROJECT | QRmor.”
- Reduce case-study titles by roughly 25–30% on desktop and mobile.
- Rename the Soapbox case study to “Mobile and API platform for nonprofit
  volunteer coordination.”

## Technical skills

- Rename “Capability map” to “Technical Skills.”
- Remove the abstract “No keyword wall” description.
- Use the direct section title “Technical Skills.”
- Move each card’s technology pills above its explanatory sentence so the
  actual skills appear immediately.
- Keep evidence links because they let recruiters verify where each skill was
  used.
- Reduce card title size, minimum height, and vertical spacing.

## Global below-the-fold hierarchy

- Preserve the hero headline as the primary visual statement.
- Reduce shared section headings from a 5.4rem maximum to approximately 3.8rem.
- Reduce work-card titles from a 6.6rem maximum to approximately 4.4rem.
- Reduce experience, capability, education, contact, and personal-section
  headings proportionally where they compete with the hero.
- Retain responsive `clamp()` sizing so headings remain legible without
  overflowing on mobile.

## Personal copy

Use:

> Outside engineering, I reset through weightlifting, cooking, and long trails,
> with the occasional competitive programming problem.

## Compatibility and verification

No navigation anchors, public links, data IDs, or dependencies change. Tests
should protect the revised Soapbox title and section/card content order. Run
lint, all tests, and a production build, then inspect desktop and mobile layouts
for hierarchy, wrapping, overflow, and skill visibility.

