import type { WindowGeometry, WorkbenchAppId } from "./types";

export interface WorkbenchAppDefinition {
  readonly id: WorkbenchAppId;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  readonly defaultGeometry: WindowGeometry;
}

export const workbenchApps = [
  {
    id: "overview",
    label: "System Overview",
    shortLabel: "OV",
    description: "A fast index of Gerard’s engineering profile.",
    defaultGeometry: { x: 46, y: 34, width: 620, height: 440 },
  },
  {
    id: "about",
    label: "About",
    shortLabel: "AB",
    description: "Background, focus areas, and interests.",
    defaultGeometry: { x: 118, y: 68, width: 560, height: 430 },
  },
  {
    id: "work",
    label: "Selected Work",
    shortLabel: "WK",
    description: "Engineering decisions and measurable outcomes.",
    defaultGeometry: { x: 150, y: 36, width: 690, height: 500 },
  },
  {
    id: "experience",
    label: "Experience",
    shortLabel: "EX",
    description: "A production engineering trajectory.",
    defaultGeometry: { x: 88, y: 52, width: 650, height: 490 },
  },
  {
    id: "skills",
    label: "Skills",
    shortLabel: "SK",
    description: "Capabilities connected to evidence.",
    defaultGeometry: { x: 126, y: 48, width: 620, height: 470 },
  },
  {
    id: "terminal",
    label: "Terminal",
    shortLabel: ">_",
    description: "Explore the portfolio through safe local commands.",
    defaultGeometry: { x: 200, y: 92, width: 600, height: 400 },
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "@",
    description: "Reviewed professional contact links.",
    defaultGeometry: { x: 210, y: 82, width: 520, height: 360 },
  },
] as const satisfies readonly WorkbenchAppDefinition[];

export const workbenchAppById = Object.fromEntries(
  workbenchApps.map((app) => [app.id, app]),
) as Record<WorkbenchAppId, WorkbenchAppDefinition>;
