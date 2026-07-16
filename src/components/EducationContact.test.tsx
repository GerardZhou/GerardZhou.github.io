import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { education, externalLinks } from "../portfolioData";
import { EducationContact } from "./EducationContact";

describe("EducationContact", () => {
  it("uses the approved concise contact wording", () => {
    const html = renderToStaticMarkup(
      <EducationContact education={education} links={externalLinks} />,
    );

    expect(html).toContain("Connect with me");
    expect(html).not.toContain("Build what matters");
    expect(html).not.toContain("Looking for an engineer");
  });
});
