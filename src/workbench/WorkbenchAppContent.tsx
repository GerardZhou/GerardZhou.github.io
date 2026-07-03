import {
  capabilityGroups,
  experienceTimeline,
  externalLinks,
  featuredWork,
  personalInterests,
  profile,
  proofPoints,
} from "../portfolioData";
import { TerminalApp } from "./TerminalApp";
import type { WorkbenchAppId } from "./types";

interface WorkbenchAppContentProps {
  appId: WorkbenchAppId;
  onOpenApp: (appId: WorkbenchAppId) => void;
}

function OverviewPanel({ onOpenApp }: Pick<WorkbenchAppContentProps, "onOpenApp">) {
  return (
    <div className="wb-overview">
      <div className="wb-overview-intro">
        <img
          alt="Gerard Zhou in professional attire"
          height="200"
          src={profile.portraitSrc}
          width="160"
        />
        <div>
          <p className="wb-label">Engineer profile / current</p>
          <h3>{profile.name}</h3>
          <p>{profile.introduction}</p>
        </div>
      </div>
      <div className="wb-metric-grid" aria-label="Selected impact metrics">
        {proofPoints.map((point) => (
          <button key={point.value} onClick={() => onOpenApp("work")} type="button">
            <strong>{point.value}</strong>
            <span>{point.label}</span>
            <small>{point.context}</small>
          </button>
        ))}
      </div>
      <div className="wb-overview-actions">
        <button onClick={() => onOpenApp("work")} type="button">
          Open selected work
        </button>
        <button onClick={() => onOpenApp("terminal")} type="button">
          Launch terminal
        </button>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="wb-prose-panel">
      <p className="wb-label">About / readme.md</p>
      <h3>Infrastructure instincts, product range.</h3>
      <p>{profile.introduction}</p>
      <p>
        My work has moved from production test quality to mobile and API systems,
        Kubernetes automation, and cloud release infrastructure. I care about clear
        failure modes, measurable outcomes, and tools that make complex systems easier
        to operate.
      </p>
      <div className="wb-interest-row" aria-label="Outside of engineering">
        {personalInterests.map((interest) => (
          <span key={interest}>{interest}</span>
        ))}
      </div>
    </div>
  );
}

function WorkPanel() {
  return (
    <div className="wb-list-panel">
      <div className="wb-list-heading">
        <p className="wb-label">Selected work / evidence index</p>
        <h3>Decisions, systems, outcomes.</h3>
      </div>
      {featuredWork.map((item, index) => (
        <a href={`#work-${item.id}`} key={item.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>{item.title}</strong>
            <small>{item.organization}</small>
          </div>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="wb-timeline-panel">
      <p className="wb-label">Experience / chronological</p>
      {experienceTimeline.map((item, index) => (
        <article key={item.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <small>{item.timeframe}</small>
            <h3>{item.organization}</h3>
            <p>{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function LabPanel() {
  return (
    <div className="wb-prose-panel wb-lab-panel">
      <p className="wb-label">Systems lab / deterministic model</p>
      <h3>When does a healthy queue become fragile?</h3>
      <p>
        Explore how demand, capacity, and retry behavior compound into tail latency.
        The model is synthetic and deliberately scoped—it demonstrates analytical
        reasoning, not production telemetry.
      </p>
      <a className="wb-inline-link" href="#signal-lab">
        Open the full interactive model <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}

function SkillsPanel() {
  return (
    <div className="wb-skill-panel">
      <p className="wb-label">Capabilities / linked evidence</p>
      {capabilityGroups.map((group) => (
        <article key={group.title}>
          <h3>{group.title}</h3>
          <p>{group.summary}</p>
          <div>
            {group.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="wb-prose-panel wb-contact-panel">
      <p className="wb-label">Contact / reviewed destinations</p>
      <h3>Let’s discuss difficult systems and useful products.</h3>
      <p>
        I’m open to software engineering and quantitative engineering internship
        conversations.
      </p>
      <div className="wb-contact-links">
        {externalLinks.map((link) => (
          <a
            href={link.href}
            key={link.id}
            rel={link.kind === "profile" ? "noreferrer" : undefined}
            target={link.kind === "profile" ? "_blank" : undefined}
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/** Renders application content while the workbench owns window state and chrome. */
export function WorkbenchAppContent({ appId, onOpenApp }: WorkbenchAppContentProps) {
  switch (appId) {
    case "overview":
      return <OverviewPanel onOpenApp={onOpenApp} />;
    case "about":
      return <AboutPanel />;
    case "work":
      return <WorkPanel />;
    case "experience":
      return <ExperiencePanel />;
    case "lab":
      return <LabPanel />;
    case "skills":
      return <SkillsPanel />;
    case "terminal":
      return <TerminalApp onOpenApp={onOpenApp} />;
    case "contact":
      return <ContactPanel />;
  }
}
