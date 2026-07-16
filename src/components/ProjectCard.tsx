import type { FeaturedWork } from "../portfolioData";
import { ArrowUpRightIcon } from "./Icons";

interface ProjectCardProps {
  readonly index: number;
  readonly project: FeaturedWork;
}

/** A visual project summary that keeps public and private code states explicit. */
export function ProjectCard({ index, project }: ProjectCardProps) {
  const publicUrl = project.code.visibility === "public" ? project.code.url : null;

  return (
    <article
      className={`project-card project-card-${project.id}`}
      id={`work-${project.id}`}
    >
      <div className={`project-visual${project.visual ? " project-visual-image" : ""}`}>
        {project.visual ? (
          <img
            alt={project.visual.alt}
            className="project-image"
            loading="lazy"
            src={project.visual.src}
          />
        ) : (
          <div className="project-contours" aria-hidden="true" />
        )}
        <span className="project-index">TRAIL {String(index + 1).padStart(2, "0")}</span>
        <span className="project-marker" aria-hidden="true">
          {project.id === "qrmor" ? "QR" : "UT"}
        </span>
        <p>{project.organization}</p>
      </div>

      <div className="project-card-body">
        <p className="project-organization">{project.organization}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>

        <ul className="project-outcomes" aria-label={`${project.title} key features`}>
          <li>
            <span>Approach</span>
            {project.approach}
          </li>
          <li>
            <span>Outcome</span>
            {project.result}
          </li>
        </ul>

        <ul className="technology-list" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>

        <div className="project-links">
          {project.demo ? (
            <a href={project.demo.url} rel="noreferrer" target="_blank">
              {project.demo.label}
              <ArrowUpRightIcon />
            </a>
          ) : null}
          {publicUrl ? (
            <a href={publicUrl} rel="noreferrer" target="_blank">
              Source code
              <ArrowUpRightIcon />
            </a>
          ) : (
            <span className="private-work" title={project.code.note}>
              {project.code.label}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
