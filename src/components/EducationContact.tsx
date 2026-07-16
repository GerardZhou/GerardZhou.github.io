import type { Education, ExternalLink } from "../portfolioData";
import { ArrowUpRightIcon } from "./Icons";

interface EducationContactProps {
  // Content arrives as props so editing portfolioData updates this view automatically.
  education: Education;
  links: readonly ExternalLink[];
}

/** Renders the final education, call-to-action, and footer regions of the page. */
export function EducationContact({ education, links }: EducationContactProps) {
  return (
    // A Fragment groups sibling page sections without adding a layout-altering wrapper element.
    <>
      <section className="education-section" id="education">
        <div className="education-label">
          <span>06</span>
          <p>Education</p>
        </div>
        <div className="education-main">
          <p>{education.degree}</p>
          <h2>{education.institution}</h2>
          <div className="education-details">
            <span>{education.timeframe}</span>
            <span>{education.location}</span>
            <span>GPA {education.gpa}</span>
          </div>
        </div>
        <div className="coursework">
          <p>Selected foundations</p>
          <ul>
            {/* Course names are unique within this short list, so each can serve as its key. */}
            {education.coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="contact-kicker">Build what matters</p>
        <h2>Looking for an engineer who can move between rigor and execution?</h2>
        <p className="contact-copy">
          I’m open to quantitative engineering and software engineering internship
          conversations. Let’s talk about difficult systems and useful products.
        </p>
        <div className="contact-links">
          {links.map((link) => (
            // Web URLs open in a new tab; mailto links stay in the current browsing context.
            // rel="noreferrer" prevents the new page from receiving this page's referrer data.
            <a
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target={link.href.startsWith("http") ? "_blank" : undefined}
            >
              {link.label}
              <ArrowUpRightIcon />
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>Gerard Zhou · Austin, Texas</p>
        <p>Designed for clarity. Built for speed.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
