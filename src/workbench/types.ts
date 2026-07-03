/** Every internal application that can open inside the portfolio workbench. */
export type WorkbenchAppId =
  | "overview"
  | "about"
  | "work"
  | "experience"
  | "skills"
  | "terminal"
  | "contact";

/** Coordinates are relative to the desktop screen, not the browser window. */
export interface WindowGeometry {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DesktopBounds {
  readonly width: number;
  readonly height: number;
}

export interface DesktopWindowState {
  readonly appId: WorkbenchAppId;
  readonly geometry: WindowGeometry;
  readonly restoreGeometry: WindowGeometry | null;
  readonly isMaximized: boolean;
}

export interface WindowManagerState {
  /** The final item is visually on top and receives active-window styling. */
  readonly windows: readonly DesktopWindowState[];
  readonly activeAppId: WorkbenchAppId | null;
}
