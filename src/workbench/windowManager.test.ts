import { describe, expect, it } from "vitest";
import {
  clampWindowGeometry,
  initialWindowManagerState,
  windowManagerReducer,
} from "./windowManager";
import type { WindowGeometry, WindowManagerState } from "./types";

const geometry: WindowGeometry = { x: 40, y: 32, width: 520, height: 360 };
const bounds = { width: 1000, height: 640 };

function openTwoWindows(): WindowManagerState {
  const overview = windowManagerReducer(initialWindowManagerState, {
    type: "open",
    appId: "overview",
    geometry,
  });

  return windowManagerReducer(overview, {
    type: "open",
    appId: "terminal",
    geometry: { ...geometry, x: 90, y: 70 },
  });
}

describe("windowManagerReducer", () => {
  it("opens a window and makes it active", () => {
    const state = windowManagerReducer(initialWindowManagerState, {
      type: "open",
      appId: "overview",
      geometry,
    });

    expect(state.activeAppId).toBe("overview");
    expect(state.windows).toHaveLength(1);
    expect(state.windows[0]?.geometry).toEqual(geometry);
  });

  it("focuses an existing window instead of duplicating it", () => {
    const state = openTwoWindows();
    const reopened = windowManagerReducer(state, {
      type: "open",
      appId: "overview",
      geometry,
    });

    expect(reopened.windows).toHaveLength(2);
    expect(reopened.windows.at(-1)?.appId).toBe("overview");
    expect(reopened.activeAppId).toBe("overview");
  });

  it("closes the active window and activates the next visible window", () => {
    const state = openTwoWindows();
    const closed = windowManagerReducer(state, {
      type: "close",
      appId: "terminal",
    });

    expect(closed.windows.map((item) => item.appId)).toEqual(["overview"]);
    expect(closed.activeAppId).toBe("overview");
  });

  it("ignores actions for windows that are not open", () => {
    const state = openTwoWindows();

    expect(
      windowManagerReducer(state, { type: "focus", appId: "skills" }),
    ).toBe(state);
    expect(
      windowManagerReducer(state, { type: "close", appId: "skills" }),
    ).toBe(state);
  });

  it("maximizes and restores a window without losing its geometry", () => {
    const state = openTwoWindows();
    const maximized = windowManagerReducer(state, {
      type: "maximize",
      appId: "overview",
      bounds,
    });
    const target = maximized.windows.at(-1);

    expect(target?.isMaximized).toBe(true);
    expect(target?.restoreGeometry).toEqual(geometry);
    expect(target?.geometry).toEqual({ x: 12, y: 12, width: 976, height: 616 });

    const restored = windowManagerReducer(maximized, {
      type: "restore",
      appId: "overview",
    });

    expect(restored.windows.at(-1)?.geometry).toEqual(geometry);
    expect(restored.windows.at(-1)?.restoreGeometry).toBeNull();
  });

  it("does not move a maximized window", () => {
    const state = windowManagerReducer(
      windowManagerReducer(initialWindowManagerState, {
        type: "open",
        appId: "overview",
        geometry,
      }),
      { type: "maximize", appId: "overview", bounds },
    );

    const moved = windowManagerReducer(state, {
      type: "move",
      appId: "overview",
      x: 400,
      y: 400,
      bounds,
    });

    expect(moved.windows[0]?.geometry).toEqual(state.windows[0]?.geometry);
  });
});

describe("clampWindowGeometry", () => {
  it("keeps a recoverable portion of the title bar visible", () => {
    expect(clampWindowGeometry(geometry, -900, 900, bounds)).toEqual({
      ...geometry,
      x: -408,
      y: 594,
    });
  });

  it("accepts coordinates already inside the desktop bounds", () => {
    expect(clampWindowGeometry(geometry, 180, 120, bounds)).toEqual({
      ...geometry,
      x: 180,
      y: 120,
    });
  });
});
