# Project Carousel Expansion Design

## Goal

Expand the portfolio's project rail while making it easier to navigate and less visually repetitive. Keep the established nature-inspired card system, but remove the center trail-marker badge that competes with project content.

## Approved design

- Add four public projects: Huffman Coding, College Football Graph Assignment, Doubly Linked List, and CNN Image Classifier.
- Give each card a short project-specific eyebrow label instead of the numbered `TRAIL` label.
- Remove the center marker and its circular/map-pin decoration from every project visual.
- Preserve horizontal mouse, trackpad, touch, and keyboard scrolling.
- Add previous and next buttons that move the rail by one card and disable at the respective ends.
- Keep source links explicit and open public repositories in a new tab.
- Retain the current card dimensions, responsive behavior, topo texture, and restrained color palette.

## Content changes

- Shorten the hero headline to `I build reliable systems.`
- Remove the sentence about tradeoffs, measurable outcomes, and operability from the introduction.
- Replace the contact pitch with the simple heading `Connect with me` and the existing links.
- Describe Huffman Coding as a partnered Java implementation rather than individual work.

## Accessibility and behavior

- Arrow buttons have visible labels for assistive technology.
- Disabled states communicate when the rail is at its first or last card.
- The rail remains focusable and retains its existing region label.
- Scroll-state updates are driven by the native scroll position and resize observations without adding dependencies.

## Validation

- Add data-contract tests for all nine public project repositories.
- Add rendering tests for project-specific eyebrow labels, the absence of marker badges, and carousel controls.
- Run unit tests, linting, TypeScript checks, production build, and desktop/mobile browser verification.

## Approval

Approved by the user on 2026-07-16. The design document and implementation remain uncommitted until the user reviews the local preview.
