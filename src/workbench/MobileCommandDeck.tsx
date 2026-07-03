import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { externalLinks } from "../portfolioData";
import { workbenchAppById, workbenchApps } from "./appRegistry";
import type { WorkbenchAppId } from "./types";
import { WorkbenchAppContent } from "./WorkbenchAppContent";

export function MobileCommandDeck() {
  const [activeAppId, setActiveAppId] = useState<WorkbenchAppId | null>(null);
  const lastLauncher = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const activeDefinition = activeAppId ? workbenchAppById[activeAppId] : null;

  useEffect(() => {
    if (!activeAppId) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeAppId]);

  function openApp(event: MouseEvent<HTMLButtonElement>, appId: WorkbenchAppId) {
    lastLauncher.current = event.currentTarget;
    setActiveAppId(appId);
  }

  function closeApp() {
    setActiveAppId(null);
    window.requestAnimationFrame(() => lastLauncher.current?.focus());
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeApp();
    }
  }

  return (
    <div className="mobile-command-deck">
      <div className="mobile-deck-status">
        <span>GerardOS</span>
        <span>Touch interface</span>
      </div>
      <div className="mobile-app-grid">
        {workbenchApps.map((app) => (
          <button key={app.id} onClick={(event) => openApp(event, app.id)} type="button">
            <span aria-hidden="true">{app.shortLabel}</span>
            <strong>{app.label}</strong>
            <small>{app.description}</small>
          </button>
        ))}
      </div>
      <div className="mobile-profile-links">
        {externalLinks
          .filter((link) => link.kind === "profile")
          .map((link) => (
            <a href={link.href} key={link.id} rel="noreferrer" target="_blank">
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
      </div>

      {activeAppId && activeDefinition ? (
        <section
          aria-label={`${activeDefinition.label} application`}
          aria-modal="true"
          className="mobile-app-panel"
          onKeyDown={handlePanelKeyDown}
          role="dialog"
        >
          <header>
            <div>
              <span aria-hidden="true">{activeDefinition.shortLabel}</span>
              <strong>{activeDefinition.label}</strong>
            </div>
            <button
              aria-label={`Close ${activeDefinition.label}`}
              onClick={closeApp}
              ref={closeButton}
              type="button"
            >
              Close
            </button>
          </header>
          <div className="mobile-app-content">
            <WorkbenchAppContent appId={activeAppId} onOpenApp={setActiveAppId} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
