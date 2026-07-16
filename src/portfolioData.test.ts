import { describe, expect, it } from "vitest";
import {
  capabilityGroups,
  experienceTimeline,
  externalLinks,
  featuredWork,
  personalInterests,
  proofPoints,
} from "./portfolioData";

// These tests protect the public-link allowlist. They make privacy changes
// deliberate: adding a new destination requires reviewing and updating the
// expected contract here instead of publishing it accidentally.
describe("public portfolio links", () => {
  it("contains only the approved profile and contact destinations", () => {
    expect(externalLinks.map((link) => link.id).sort()).toEqual([
      "email",
      "github",
      "linkedin",
    ]);
  });

  it("uses the designated public contact address", () => {
    const email = externalLinks.find((link) => link.id === "email");

    expect(email?.href).toBe("mailto:gerardzhou07@gmail.com");
  });

  it("uses secure web URLs for every profile", () => {
    const profileLinks = externalLinks.filter((link) => link.kind === "profile");

    expect(profileLinks).toHaveLength(2);
    expect(profileLinks.every((link) => link.href.startsWith("https://"))).toBe(true);
  });
});

describe("portfolio data invariants", () => {
  it("keeps featured work IDs unique", () => {
    const ids = featuredWork.map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps proof-point values unique and non-empty", () => {
    expect(new Set(proofPoints.map((item) => item.value)).size).toBe(
      proofPoints.length,
    );
    expect(
      proofPoints.every((item) => item.label.length > 0 && item.context.length > 0),
    ).toBe(true);
  });

  it("points capability evidence at known page anchors", () => {
    const knownAnchors = new Set([
      "#education",
      ...featuredWork
        .filter((item) => item.kind === "project")
        .map((item) => `#work-${item.id}`),
      ...experienceTimeline.map((item) => `#experience-${item.id}`),
    ]);
    const evidenceLinks = capabilityGroups.flatMap((group) =>
      group.evidence.map((item) => item.href),
    );

    expect(evidenceLinks.every((href) => knownAnchors.has(href))).toBe(true);
  });

  it("includes only the approved personal interests", () => {
    expect(personalInterests).toEqual([
      "Hiking",
      "Weightlifting",
      "Cooking",
      "Chess",
      "Basketball",
      "Competitive programming",    
    ]);
  });

  it("describes the OCI automation result as a target", () => {
    const oracle = experienceTimeline.find((item) => item.id === "oracle");

    expect(oracle?.highlights).toContain(
      "Designing a CI/CD release path to automate a 45-minute manual workflow, targeting a reduction to 5 minutes—an 89% improvement.",
    );
  });

  it("uses the approved nonprofit-focused Soapbox title", () => {
    const soapbox = featuredWork.find((item) => item.id === "soapbox");

    expect(soapbox?.title).toBe(
      "Mobile and API platform for nonprofit volunteer coordination",
    );
  });

  it("keeps at least two projects available for the project-card grid", () => {
    const projects = featuredWork.filter((item) => item.kind === "project");

    expect(projects.length).toBeGreaterThanOrEqual(2);
    expect(projects.every((item) => item.summary.length > 0)).toBe(true);
  });
});
