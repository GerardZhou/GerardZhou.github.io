import type { ExperienceEntry } from "../portfolioData";
import { ExperienceCard } from "./ExperienceCard";
import { SectionHeading } from "./SectionHeading";

interface ExperienceTimelineProps {
  // The parent decides ordering; this component only renders the supplied timeline.
  items: readonly ExperienceEntry[];
}

/** Turns structured experience data into a semantic ordered timeline. */
export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <section className="content-section experience-section" id="experience">
      <SectionHeading
        index="02"
        kicker="Experience"
        title="Growing ownership, one system at a time."
        description="My work has moved from algorithms research and test quality to product APIs, Kubernetes automation, and cloud infrastructure."
      />

      {/* An ordered list preserves the timeline's sequence for browsers and assistive technology. */}
      <ol className="experience-list">
        {items.map((entry, index) => (
          <ExperienceCard entry={entry} index={index} key={entry.id} />
        ))}
      </ol>
    </section>
  );
}
