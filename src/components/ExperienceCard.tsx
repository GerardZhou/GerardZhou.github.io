import type { ExperienceEntry } from "../portfolioData";

interface ExperienceCardProps {
  readonly entry: ExperienceEntry;
  readonly index: number;
}

/** A consistent, recruiter-friendly summary for one role. */
export function ExperienceCard({ entry, index }: ExperienceCardProps) {
  return (
    <li className="experience-card" id={`experience-${entry.id}`}>
      <div className="experience-card-meta">
        <span className="trail-marker" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p>{entry.timeframe}</p>
          {entry.location ? <p>{entry.location}</p> : null}
        </div>
      </div>

      <div className="experience-card-copy">
        <p className="experience-role">{entry.role}</p>
        <h3>{entry.organization}</h3>
        <p className="experience-summary">{entry.summary}</p>
        <ul className="experience-highlights">
          {entry.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <ul className="technology-list" aria-label={`${entry.organization} technologies`}>
          {entry.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
