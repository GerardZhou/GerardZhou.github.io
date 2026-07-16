import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { FeaturedWork as FeaturedWorkEntry } from "../portfolioData";
import { featuredWork } from "../portfolioData";
import { FeaturedWork } from "./FeaturedWork";
import { ProjectCard } from "./ProjectCard";

describe("ProjectCard", () => {
  it("renders a safe source link only for public projects", () => {
    const publicProject = featuredWork.find((item) => item.id === "qrmor")!;
    const privateProject = featuredWork.find((item) => item.id === "mobilizeut")!;
    const publicHtml = renderToStaticMarkup(
      <ProjectCard index={0} project={publicProject} />,
    );
    const privateHtml = renderToStaticMarkup(
      <ProjectCard index={1} project={privateProject} />,
    );

    expect(publicHtml).toContain("Source code");
    expect(publicHtml).toContain('target="_blank"');
    expect(publicHtml).toContain('rel="noreferrer"');
    expect(privateHtml).not.toContain('target="_blank"');
    expect(privateHtml).toContain("Team repository");
  });

  it("keeps employment entries out of the project grid", () => {
    const html = renderToStaticMarkup(<FeaturedWork items={featuredWork} />);

    expect(html).toContain("Accessibility preferences built into route planning");
    expect(html).toContain("More context before opening a QR-code destination");
    expect(html).not.toContain("Kubernetes lifecycle management, packaged as an operator");
  });

  it("supports an optional project image and live demo", () => {
    const baseProject = featuredWork.find((item) => item.id === "qrmor")!;
    const project: FeaturedWorkEntry = {
      ...baseProject,
      visual: { src: "/project-preview.jpg", alt: "QRmor project preview" },
      demo: { label: "Live demo", url: "https://example.com/demo" },
    };
    const html = renderToStaticMarkup(<ProjectCard index={0} project={project} />);

    expect(html).toContain('src="/project-preview.jpg"');
    expect(html).toContain('alt="QRmor project preview"');
    expect(html).toContain('href="https://example.com/demo"');
    expect(html).toContain("Live demo");
  });
});
