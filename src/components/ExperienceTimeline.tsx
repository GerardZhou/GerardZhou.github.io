import type { ExperienceEntry } from "../portfolioData";
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
        kicker="Trajectory"
        title="From application code to cloud control planes."
        description="Five engineering roles, each adding a deeper layer of ownership: algorithms research, test quality, product systems, platform automation, and infrastructure reliability."
      />

      {/* An ordered list preserves the timeline's sequence for browsers and assistive technology. */}
      <ol className="experience-list">
        {items.map((entry, index) => (
          <li
            className="experience-item"
            id={`experience-${entry.id}`}
            key={`${entry.organization}-${entry.timeframe}`}
          >
            {/* This numbered marker is decorative because the ordered list already conveys order. */}
            <div className="experience-marker" aria-hidden="true">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="experience-meta">
              <p>{entry.timeframe}</p>
              {/* Returning null is React's standard way to render nothing for missing data. */}
              {entry.location ? <p>{entry.location}</p> : null}
            </div>
            <div className="experience-copy">
              <p className="experience-role">{entry.role}</p>
              <h3>{entry.organization}</h3>
              <p className="experience-summary">{entry.summary}</p>
              <ul className="experience-highlights">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {/* aria-label supplies context that a bare list of technology names would lack. */}
              <ul className="technology-list" aria-label={`${entry.organization} technologies`}>
                {entry.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
