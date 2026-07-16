import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { FeaturedWork as FeaturedWorkEntry } from "../portfolioData";
import { featuredWork } from "../portfolioData";
import { FeaturedWork } from "./FeaturedWork";
import { ProjectCard } from "./ProjectCard";

describe("ProjectCard", () => {
  it("renders a safe source link only for public projects", () => {
    const publicProject = featuredWork.find((item) => item.id === "qrmor")!;
    const privateProject: FeaturedWorkEntry = {
      ...publicProject,
      code: {
        visibility: "unavailable",
        label: "Private repository",
        note: "Source is unavailable.",
      },
    };
    const publicHtml = renderToStaticMarkup(
      <ProjectCard project={publicProject} />,
    );
    const privateHtml = renderToStaticMarkup(
      <ProjectCard project={privateProject} />,
    );

    expect(publicHtml).toContain("Source code");
    expect(publicHtml).toContain('target="_blank"');
    expect(publicHtml).toContain('rel="noreferrer"');
    expect(privateHtml).not.toContain('target="_blank"');
    expect(privateHtml).toContain("Private repository");
  });

  it("keeps employment entries out of the project grid", () => {
    const html = renderToStaticMarkup(<FeaturedWork items={featuredWork} />);

    expect(html).toContain("Accessibility preferences built into route planning");
    expect(html).toContain("Free AP study resources, organized for 500+ students");
    expect(html).toContain("Cleanup participation and impact, connected end to end");
    expect(html).toContain("A tabletop strategy game engine built in Java");
    expect(html).toContain("Lossless compression, built from the bit level up");
    expect(html).toContain("Ranking college football teams through graph centrality");
    expect(html).toContain("A generic list engineered for bidirectional traversal");
    expect(html).toContain("Training a CNN to distinguish cats from dogs");
    expect(html).toContain("More context before opening a QR-code destination");
    expect(html).not.toContain("Kubernetes lifecycle management, packaged as an operator");
  });

  it("renders project-specific labels without trail-marker badges", () => {
    const project = featuredWork.find((item) => item.id === "kingdom-builder")!;
    const html = renderToStaticMarkup(<ProjectCard project={project} />);

    expect(html).toContain("Strategy game");
    expect(html).not.toContain("TRAIL");
    expect(html).not.toContain("project-marker");
  });

  it("renders accessible previous and next controls for the project rail", () => {
    const html = renderToStaticMarkup(<FeaturedWork items={featuredWork} />);

    expect(html).toContain('aria-label="Show previous project"');
    expect(html).toContain('aria-label="Show next project"');
    expect(html).toContain("Explore 9 projects");
  });

  it("supports an optional project image and live demo", () => {
    const baseProject = featuredWork.find((item) => item.id === "qrmor")!;
    const project: FeaturedWorkEntry = {
      ...baseProject,
      visual: { src: "/project-preview.jpg", alt: "QRmor project preview" },
      demo: { label: "Live demo", url: "https://example.com/demo" },
    };
    const html = renderToStaticMarkup(<ProjectCard project={project} />);

    expect(html).toContain('src="/project-preview.jpg"');
    expect(html).toContain('alt="QRmor project preview"');
    expect(html).toContain('href="https://example.com/demo"');
    expect(html).toContain("Live demo");
  });
});
