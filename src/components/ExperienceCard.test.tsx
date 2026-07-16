import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ExperienceEntry } from "../portfolioData";
import { ExperienceCard } from "./ExperienceCard";

const entry: ExperienceEntry = {
  id: "ibm",
  organization: "Example Organization",
  role: "Software Engineer Intern",
  timeframe: "Jan 2026 - May 2026",
  location: "Austin, TX",
  summary: "Built a dependable system.",
  highlights: ["Reduced manual configuration."],
  technologies: ["Go", "Kubernetes"],
};

describe("ExperienceCard", () => {
  it("renders the complete role hierarchy and technology context", () => {
    const html = renderToStaticMarkup(<ExperienceCard entry={entry} index={0} />);

    expect(html).toContain("Software Engineer Intern");
    expect(html).toContain("Example Organization");
    expect(html).toContain("Jan 2026 - May 2026");
    expect(html).toContain("Austin, TX");
    expect(html).toContain('aria-label="Example Organization technologies"');
  });
});
