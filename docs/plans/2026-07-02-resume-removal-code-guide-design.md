# Résumé Removal and Beginner Code Guide Design

Date: 2026-07-02
Status: Approved

## Context

The portfolio is ready for GitHub Pages, but Gerard does not want a résumé published yet. He also wants the repository to teach him how the site works because he is still learning React, TypeScript, CSS, and deployment workflows.

Two email addresses have different responsibilities:

- `dorey1200@gmail.com` identifies Git commits for the GitHub account.
- `gerardzhou07@gmail.com` remains the public contact address shown on the website.

## Decision

Remove the résumé completely for now. The deployed website and repository will contain no résumé file, button, data entry, or placeholder. A later résumé upload will be an explicit opt-in process documented in the repository.

Keep the existing React and Vite architecture. Improve explainability with comments that describe intent, component boundaries, data flow, accessibility choices, simulation logic, style organization, tests, and deployment. Comments should explain *why* code exists or how a non-obvious block works; they should not merely restate each line.

Add a beginner-oriented `CODE_GUIDE.md` containing:

- a project map;
- the page's data flow;
- common editing tasks;
- local development and validation commands;
- safe résumé upload instructions; and
- GitHub Pages deployment instructions.

## Alternatives Considered

1. **Remove the résumé completely — selected.** This has the lowest privacy risk and creates no misleading control.
2. **Keep résumé wiring behind a feature flag.** This makes re-enabling easier but leaves unnecessary code and increases the chance of accidental publication.
3. **Show “Résumé available on request.”** This is safe, but the existing contact link already provides that path and the placeholder adds little recruiter value.

## Validation

The update is complete when:

- no tracked file or rendered link references a résumé;
- the public contact email remains `gerardzhou07@gmail.com`;
- every published commit uses `dorey1200@gmail.com`;
- lint, unit tests, and the production build pass;
- a repository scan finds no résumé artifact, old commit email, phone number, or obvious credential; and
- documentation explains how to add a reviewed résumé later without committing it accidentally first.

## Rollout

The history is still local, so commit metadata can be rewritten safely before the first push. After validation, create the public `GerardZhou.github.io` repository, push `main`, let the GitHub Actions workflow deploy the site, and verify the live URL.
