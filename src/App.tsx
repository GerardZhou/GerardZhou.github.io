import { CapabilityMap } from "./components/CapabilityMap";
import { EducationContact } from "./components/EducationContact";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { FeaturedWork } from "./components/FeaturedWork";
import { ArrowDownIcon, ArrowUpRightIcon, MountainIcon } from "./components/Icons";
import {
  capabilityGroups,
  education,
  experienceTimeline,
  externalLinks,
  featuredWork,
  personalInterests,
  profile,
  proofPoints,
} from "./portfolioData";
import { Workbench } from "./workbench/Workbench";

// Looking links up once avoids scattering public destinations across the page.
// The data test protects this allowlist, so these assertions remain deliberate.
const linkById = {
  github: externalLinks.find((link) => link.id === "github")!,
  linkedin: externalLinks.find((link) => link.id === "linkedin")!,
  email: externalLinks.find((link) => link.id === "email")!,
};

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Gerard Zhou, home">
          <span className="wordmark-mark">GZ</span>
          <span className="wordmark-name">Gerard Zhou</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#selected-work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#capabilities">Skills</a>
          <a href="#workbench">Workbench</a>
          <a href="#contact">Contact</a>
        </nav>

      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">
              <MountainIcon />
              {profile.eyebrow}
            </p>
            <h1 id="hero-heading">{profile.headline}</h1>
            <p className="hero-intro">{profile.introduction}</p>

            <div className="hero-actions" aria-label="Primary actions">
              <a className="button button-primary" href="#selected-work">
                Explore selected projects
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
              <a className="button button-secondary" href={linkById.email.href}>
                Email
                <ArrowUpRightIcon />
              </a>
            </div>
          </div>

          <aside className="hero-portrait-card" aria-label="Gerard Zhou profile">
            <div className="portrait-frame">
              <img
                alt="Gerard Zhou wearing professional attire"
                fetchPriority="high"
                height="1000"
                src={profile.portraitSrc}
                width="800"
              />
            </div>
            <p className="portrait-card-footer">
              <span>Based in Austin, TX</span>
              Computer Science @ UT Austin
            </p>
          </aside>
        </section>

        <section className="proof-strip" aria-label="Selected impact metrics">
          {proofPoints.map((point) => (
            <article className="proof-point" key={point.value}>
              <p className="proof-value">{point.value}</p>
              <p className="proof-label">{point.label}</p>
              <p className="proof-context">{point.context}</p>
            </article>
          ))}
        </section>

        <FeaturedWork items={featuredWork} />
        <ExperienceTimeline items={experienceTimeline} />
        <CapabilityMap groups={capabilityGroups} />
        <Workbench />

        <section className="personal-section" aria-labelledby="personal-heading">
          <div>
            <p className="section-number">05 / Beyond code</p>
            <h2 id="personal-heading">A life beyond the screen.</h2>
          </div>
          <div className="personal-copy">
            <p>
              Outside engineering, I reset on long trails, in the gym, and around a table—cooking,
              playing chess, or watching basketball. Competitive programming keeps the analytical
              part of my brain moving.
            </p>
            <ul aria-label="Personal interests">
              {personalInterests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </div>
        </section>

        <EducationContact education={education} links={externalLinks} />
      </main>
    </div>
  );
}

export default App;
