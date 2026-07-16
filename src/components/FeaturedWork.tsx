import type { FeaturedWork as FeaturedWorkEntry } from "../portfolioData";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

interface FeaturedWorkProps {
  // This is a read-only view of content owned by the page-level data module.
  items: readonly FeaturedWorkEntry[];
}

/** Renders project case studies with evidence and honest code-visibility states. */
export function FeaturedWork({ items }: FeaturedWorkProps) {
  const projects = items.filter((item) => item.kind === "project");

  return (
    <section className="content-section work-section" id="selected-work">
      <SectionHeading
        index="01"
        kicker="Selected projects"
        title="Useful products, built with intent."
        description="A closer look at how I frame problems, choose tools, and turn technical decisions into practical outcomes."
      />

      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard index={index} key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
