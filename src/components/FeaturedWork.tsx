import type { FeaturedWork as FeaturedWorkEntry } from "../portfolioData";
import { ArrowUpRightIcon } from "./Icons";
import { SectionHeading } from "./SectionHeading";

interface FeaturedWorkProps {
  // This is a read-only view of content owned by the page-level data module.
  items: readonly FeaturedWorkEntry[];
}

/** Renders project case studies with evidence and honest code-visibility states. */
export function FeaturedWork({ items }: FeaturedWorkProps) {
  return (
    <section className="content-section work-section" id="selected-work">
      <SectionHeading
        index="01"
        kicker="Selected evidence"
        title="Work that holds up under scrutiny."
        description="A focused set of systems and products, framed around the problem, the engineering decision, and the measurable result."
      />

      <div className="work-list">
        {/* Braces after the arrow create a function body, letting us derive values before JSX. */}
        {items.map((work, index) => {
          // Only public work gets an outbound link; private work receives a text label below.
          const publicUrl = work.code.visibility === "public" ? work.code.url : null;

          return (
            <article className="work-card" id={`work-${work.id}`} key={work.id}>
              {/* The rail repeats visual metadata, so it is hidden from assistive technology. */}
              <div className="work-card-rail" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{work.timeframe ?? "Independent project"}</span>
              </div>

              <div className="work-card-main">
                <div className="work-card-topline">
                  <span className="work-kind">{work.kind}</span>
                  <span className="work-organization">{work.organization}</span>
                </div>
                <h3>{work.title}</h3>
                <p className="work-summary">{work.summary}</p>

                {/* A definition list pairs each engineering category with its explanation. */}
                <dl className="work-evidence">
                  <div>
                    <dt>Constraint</dt>
                    <dd>{work.challenge}</dd>
                  </div>
                  <div>
                    <dt>Approach</dt>
                    <dd>{work.approach}</dd>
                  </div>
                </dl>

                <div className="work-result">
                  <span>Result</span>
                  <p>{work.result}</p>
                </div>

                <div className="work-card-footer">
                  <ul className="technology-list" aria-label={`${work.title} technologies`}>
                    {work.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>

                  {/* Conditional rendering keeps private repository URLs out of the document. */}
                  {publicUrl ? (
                    <a href={publicUrl} rel="noreferrer" target="_blank">
                      {work.code.label}
                      <ArrowUpRightIcon />
                    </a>
                  ) : (
                    // The title offers extra context to mouse users without pretending this is a link.
                    <span className="private-work" title={work.code.note}>
                      {work.code.label}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
