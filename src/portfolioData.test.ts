import { describe, expect, it } from "vitest";
import { externalLinks } from "./portfolioData";

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
