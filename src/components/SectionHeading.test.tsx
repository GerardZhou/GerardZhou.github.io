import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("omits the description element when supporting copy is unnecessary", () => {
    const html = renderToStaticMarkup(
      <SectionHeading index="03" kicker="Skills" title="Technical Skills" />,
    );

    expect(html).toContain("Technical Skills");
    expect(html).not.toContain("section-heading-description");
  });
});
