import type { RefCallback } from "react";
import { externalLinks } from "../portfolioData";
import { workbenchApps } from "./appRegistry";
import type { WorkbenchAppId } from "./types";

interface DockProps {
  activeAppId: WorkbenchAppId | null;
  openAppIds: ReadonlySet<WorkbenchAppId>;
  onOpenApp: (appId: WorkbenchAppId) => void;
  registerLauncher: (appId: WorkbenchAppId) => RefCallback<HTMLButtonElement>;
}

const profileLinks = externalLinks.filter((link) => link.kind === "profile");

export function Dock({
  activeAppId,
  openAppIds,
  onOpenApp,
  registerLauncher,
}: DockProps) {
  return (
    <nav aria-label="Workbench applications" className="wb-dock">
      {workbenchApps.map((app) => (
        <button
          aria-label={`Open ${app.label}`}
          className={activeAppId === app.id ? "is-active" : undefined}
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          ref={registerLauncher(app.id)}
          title={app.label}
          type="button"
        >
          <span aria-hidden="true">{app.shortLabel}</span>
          {openAppIds.has(app.id) ? <i aria-hidden="true" /> : null}
        </button>
      ))}
      <span aria-hidden="true" className="wb-dock-separator" />
      {profileLinks.map((link) => (
        <a
          aria-label={`Open ${link.label} in a new tab`}
          href={link.href}
          key={link.id}
          rel="noreferrer"
          target="_blank"
          title={link.label}
        >
          <span aria-hidden="true">{link.id === "github" ? "GH" : "in"}</span>
        </a>
      ))}
    </nav>
  );
}
