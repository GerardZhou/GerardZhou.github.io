import { useCallback, useEffect, useRef, useState } from "react";

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
  const projectGridRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollBackward: false,
    canScrollForward: projects.length > 1,
  });

  const updateScrollState = useCallback(() => {
    const projectGrid = projectGridRef.current;

    if (!projectGrid) {
      return;
    }

    const maximumScroll = projectGrid.scrollWidth - projectGrid.clientWidth;
    const edgeTolerance = 2;

    setScrollState({
      canScrollBackward: projectGrid.scrollLeft > edgeTolerance,
      canScrollForward: projectGrid.scrollLeft < maximumScroll - edgeTolerance,
    });
  }, []);

  useEffect(() => {
    const projectGrid = projectGridRef.current;

    if (!projectGrid) {
      return undefined;
    }

    updateScrollState();
    projectGrid.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      projectGrid.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [projects.length, updateScrollState]);

  const scrollByProject = (direction: -1 | 1) => {
    const projectGrid = projectGridRef.current;
    const firstProject = projectGrid?.querySelector<HTMLElement>(".project-card");

    if (!projectGrid || !firstProject) {
      return;
    }

    const columnGap = Number.parseFloat(window.getComputedStyle(projectGrid).columnGap) || 0;
    const distance = firstProject.getBoundingClientRect().width + columnGap;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    projectGrid.scrollBy({
      behavior: reducedMotion ? "auto" : "smooth",
      left: direction * distance,
    });
  };

  return (
    <section className="content-section work-section" id="selected-work">
      <SectionHeading
        index="02"
        kicker="Selected projects"
        title="Useful products, built with intent."
        description="A closer look at how I frame problems, choose tools, and turn technical decisions into practical outcomes."
      />

      <div className="project-toolbar">
        <p className="project-scroll-hint">Explore {projects.length} projects</p>
        <div aria-label="Project carousel controls" className="project-navigation" role="group">
          <button
            aria-label="Show previous project"
            disabled={!scrollState.canScrollBackward}
            onClick={() => scrollByProject(-1)}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            aria-label="Show next project"
            disabled={!scrollState.canScrollForward}
            onClick={() => scrollByProject(1)}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        aria-label="Selected projects; scroll horizontally for more"
        className="project-grid"
        ref={projectGridRef}
        role="region"
        tabIndex={0}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
