# Portfolio Content Trim Design

## Goal

Make the portfolio more focused by clarifying the OCI release-automation target,
removing the synthetic queue lab, and replacing recruiting-status language with
durable student context.

## Approved copy

Use this Oracle experience highlight:

> Designing a CI/CD release path to automate a 45-minute manual workflow,
> targeting a reduction to 5 minutes—an 89% improvement.

The wording describes a target rather than a completed outcome.

## Lab removal

Remove the synthetic queue lab completely. This includes:

- the standalone page section and its React import;
- the workbench Systems Lab application and dock launcher;
- the `lab` terminal command and directory listing entry;
- simulation components, model code, tests, lab-only styles, and documentation;
- any navigation, accessibility copy, or README text that refers to the lab.

Removing every entry point avoids broken anchors and dead production code.

## Availability and portrait changes

- Remove “Open to internships” from the site header.
- Remove “available for internships” from the workbench menu bar.
- Remove the Oracle-specific “Current / Software Engineering @ OCI” portrait
  caption.
- Display the hero portrait as a circular image.
- Use the neutral caption “Computer Science @ UT Austin · Austin, TX.”

The workbench may continue to describe verified experience, including Oracle,
inside the experience and selected-work views.

## Layout and compatibility

Preserve the existing hero and workbench architecture. The portrait card should
be simplified rather than replaced with a new component. Removing the lab app
changes the internal workbench application union, registry, terminal allowlist,
and their tests together so TypeScript remains exhaustive.

Renumber visible page sections after the removal so the sequence remains
coherent. Existing public anchors unrelated to the lab remain unchanged.

## Verification

- Add or update tests for the revised portfolio copy and workbench/terminal app
  contracts.
- Run lint, the complete test suite, and a production build.
- Search the production source for removed lab and availability language.
- Inspect desktop and mobile layouts, including the circular portrait and the
  shortened section sequence.

