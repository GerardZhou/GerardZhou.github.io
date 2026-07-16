import type { CapabilityGroup } from "../portfolioData";
import { SectionHeading } from "./SectionHeading";

interface CapabilityMapProps {
  // `readonly` documents that this presentational component must not alter portfolio data.
  groups: readonly CapabilityGroup[];
}

/** Connects each skill group to concrete evidence elsewhere on the page. */
export function CapabilityMap({ groups }: CapabilityMapProps) {
  return (
    <section className="content-section capability-section" id="capabilities">
      <SectionHeading
        index="04"
        kicker="Skills"
        title="Capabilities backed by shipped work."
        description="Technical breadth matters most when it connects to decisions, systems, and results."
      />

      <div className="capability-grid">
        {/* Data-driven rendering keeps content in portfolioData instead of duplicating markup. */}
        {groups.map((group, index) => (
          // Titles are unique in the data and therefore make stable React keys.
          <article className="capability-card" key={group.title}>
            {/* padStart gives every generated index the same two-character width. */}
            <span className="capability-index">C{String(index + 1).padStart(2, "0")}</span>
            <h3>{group.title}</h3>
            <ul className="capability-skills" aria-label={`${group.title} skills`}>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p>{group.summary}</p>
            <div className="capability-evidence">
              <span>Evidence</span>
              {/* These fragment links send visitors to the relevant project or experience card. */}
              {group.evidence.map((evidence) => (
                <a href={evidence.href} key={evidence.href}>
                  {evidence.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
