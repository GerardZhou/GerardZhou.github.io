import SignalLab from "./SignalLab";
import { CapabilityMap } from "./components/CapabilityMap";
import { EducationContact } from "./components/EducationContact";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { FeaturedWork } from "./components/FeaturedWork";
import { ArrowDownIcon, ArrowUpRightIcon } from "./components/Icons";
import {
  capabilityGroups,
  education,
  experienceTimeline,
  externalLinks,
  featuredWork,
} from "./portfolioData";

// These headline numbers give a recruiter useful evidence before they scroll.
// `as const` tells TypeScript to keep the exact values instead of widening every
// string to the general `string` type.
const proofPoints = [
  {
    value: ">70%",
    label: "less configuration effort",
    context: "IBM operator workflow",
  },
  {
    value: "45 min",
    label: "manual workflow targeted",
    context: "OCI release automation",
  },
  {
    value: "20+",
    label: "backend endpoints shipped",
    context: "Soapbox platform",
  },
  {
    value: "04",
    label: "engineering internships",
    context: "cloud to product",
  },
] as const;

// The hero's right-hand panel is intentionally a compact index rather than a
// second skills list. Each row previews a theme supported later on the page.
const evidenceRows = [
  { id: "01", title: "Kubernetes operator", detail: "Go · CRDs", status: "shipped" },
  { id: "02", title: "Release automation", detail: "IaC · CI/CD", status: "in flight" },
  { id: "03", title: "Product backend", detail: "20+ endpoints", status: "shipped" },
  { id: "04", title: "Analytical core", detail: "Probability · LA", status: "active" },
] as const;

// Looking profile links up once keeps the JSX below readable. The non-null
// assertion (`!`) is safe because `portfolioData.test.ts` locks the link list.
const linkById = {
  github: externalLinks.find((link) => link.id === "github")!,
  linkedin: externalLinks.find((link) => link.id === "linkedin")!,
};

// This graphic is decorative rather than a real measurement, so it is hidden
// from screen readers. The interactive chart in SignalLab includes full labels.
function SignalPlot() {
  return (
    <svg
      aria-hidden="true"
      className="signal-plot"
      preserveAspectRatio="none"
      viewBox="0 0 540 130"
    >
      <defs>
        <linearGradient id="signal-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.24" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="signal-area"
        d="M0 105 24 99 48 103 72 79 96 83 120 60 144 66 168 41 192 47 216 55 240 35 264 50 288 28 312 36 336 21 360 43 384 30 408 50 432 35 456 21 480 31 504 14 540 24V130H0Z"
      />
      <path
        className="signal-line"
        d="M0 105 24 99 48 103 72 79 96 83 120 60 144 66 168 41 192 47 216 55 240 35 264 50 288 28 312 36 336 21 360 43 384 30 408 50 432 35 456 21 480 31 504 14 540 24"
      />
      <circle className="signal-point" cx="504" cy="14" r="4" />
    </svg>
  );
}

// App is the page-level composition component. Detailed sections live in their
// own files, while this component controls their order and the hero content.
function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="GZ — Gerard Zhou, home">
          <span className="wordmark-mark">GZ</span>
          <span className="wordmark-name">Gerard Zhou</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#selected-work">Work</a>
          <a href="#signal-lab">Lab</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* This wrapper leaves room for future header actions without coupling
            the sticky-header layout to one particular link. */}
        <div className="header-actions">
          <span className="availability">
            <span aria-hidden="true" className="availability-dot" />
            Open to internships
          </span>
        </div>
      </header>

      <main id="main-content">
        {/* The opening viewport answers three recruiter questions quickly:
            who Gerard is, what he builds, and where the supporting proof lives. */}
        <section className="hero" id="top" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">CS @ UT Austin · Software Engineering @ OCI</p>
            <h1 id="hero-heading">
              Engineering reliable systems for the moments that <em>matter.</em>
            </h1>
            <p className="hero-intro">
              I’m Gerard, a computer science student and software engineer working across
              infrastructure, platforms, and products—with a bias for rigorous thinking and
              measurable outcomes.
            </p>

            <div className="hero-actions" aria-label="Primary links">
              <a className="button button-primary" href="#selected-work">
                Explore selected work
                <ArrowDownIcon />
              </a>
              <a
                className="button button-secondary"
                href={linkById.github.href}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
                <ArrowUpRightIcon />
              </a>
              <a
                className="button button-secondary"
                href={linkById.linkedin.href}
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
                <ArrowUpRightIcon />
              </a>
            </div>
          </div>

          <aside className="evidence-panel" aria-labelledby="evidence-title">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Evidence index</p>
                <h2 id="evidence-title">Systems profile</h2>
              </div>
              <span className="panel-live">
                <span aria-hidden="true" /> Current
              </span>
            </div>

            <div className="evidence-list">
              {evidenceRows.map((row) => (
                <div className="evidence-row" key={row.id}>
                  <span className="row-id">{row.id}</span>
                  <span className="row-title">{row.title}</span>
                  <span className="row-detail">{row.detail}</span>
                  <span className={`row-status row-status-${row.status.replace(" ", "-")}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="plot-wrap">
              <div className="plot-labels">
                <span>Scope / compounding</span>
                <span>2024—26</span>
              </div>
              <SignalPlot />
            </div>
          </aside>
        </section>

        {/* Mapping data to repeated cards avoids copying the same HTML four
            times and makes future metric edits a content-only change. */}
        <section className="proof-strip" aria-label="Selected impact metrics">
          {proofPoints.map((point) => (
            <article className="proof-point" key={point.value}>
              <p className="proof-value">{point.value}</p>
              <p className="proof-label">{point.label}</p>
              <p className="proof-context">{point.context}</p>
            </article>
          ))}
        </section>

        {/* Each section receives typed data as props. This one-way flow—data to
            component to HTML—is the central React pattern used in this project. */}
        <FeaturedWork items={featuredWork} />
        <SignalLab />
        <ExperienceTimeline items={experienceTimeline} />
        <CapabilityMap groups={capabilityGroups} />
        <EducationContact education={education} links={externalLinks} />
      </main>
    </div>
  );
}

export default App;
