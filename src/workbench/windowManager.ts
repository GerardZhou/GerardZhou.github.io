import type {
  DesktopBounds,
  DesktopWindowState,
  WindowGeometry,
  WindowManagerState,
  WorkbenchAppId,
} from "./types";

const EDGE_GAP = 12;
const MIN_VISIBLE_TITLE_WIDTH = 112;
const TITLE_BAR_HEIGHT = 46;

export type WindowManagerAction =
  | Readonly<{ type: "open"; appId: WorkbenchAppId; geometry: WindowGeometry }>
  | Readonly<{ type: "focus"; appId: WorkbenchAppId }>
  | Readonly<{ type: "close"; appId: WorkbenchAppId }>
  | Readonly<{
      type: "move";
      appId: WorkbenchAppId;
      x: number;
      y: number;
      bounds: DesktopBounds;
    }>
  | Readonly<{
      type: "maximize";
      appId: WorkbenchAppId;
      bounds: DesktopBounds;
    }>
  | Readonly<{ type: "restore"; appId: WorkbenchAppId }>;

export const initialWindowManagerState: WindowManagerState = {
  windows: [],
  activeAppId: null,
};

/**
 * Moves a window while keeping enough of its title bar visible to recover it.
 * This pure helper is shared by drag interactions and reducer tests.
 */
export function clampWindowGeometry(
  geometry: WindowGeometry,
  requestedX: number,
  requestedY: number,
  bounds: DesktopBounds,
): WindowGeometry {
  const minX = Math.min(0, -geometry.width + MIN_VISIBLE_TITLE_WIDTH);
  const maxX = Math.max(0, bounds.width - MIN_VISIBLE_TITLE_WIDTH);
  const maxY = Math.max(0, bounds.height - TITLE_BAR_HEIGHT);

  return {
    ...geometry,
    x: Math.min(Math.max(requestedX, minX), maxX),
    y: Math.min(Math.max(requestedY, 0), maxY),
  };
}

function focusWindow(
  windows: readonly DesktopWindowState[],
  appId: WorkbenchAppId,
): readonly DesktopWindowState[] {
  const target = windows.find((item) => item.appId === appId);

  if (!target || windows.at(-1)?.appId === appId) {
    return windows;
  }

  return [...windows.filter((item) => item.appId !== appId), target];
}

function maximizedGeometry(bounds: DesktopBounds): WindowGeometry {
  return {
    x: EDGE_GAP,
    y: EDGE_GAP,
    width: Math.max(320, bounds.width - EDGE_GAP * 2),
    height: Math.max(240, bounds.height - EDGE_GAP * 2),
  };
}

/**
 * The workbench reducer owns all desktop state. Keeping it pure makes window
 * behavior deterministic, testable, and independent of DOM measurement.
 */
export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  switch (action.type) {
    case "open": {
      const existing = state.windows.some((item) => item.appId === action.appId);

      if (existing) {
        return {
          windows: focusWindow(state.windows, action.appId),
          activeAppId: action.appId,
        };
      }

      return {
        windows: [
          ...state.windows,
          {
            appId: action.appId,
            geometry: action.geometry,
            restoreGeometry: null,
            isMaximized: false,
          },
        ],
        activeAppId: action.appId,
      };
    }

    case "focus": {
      if (!state.windows.some((item) => item.appId === action.appId)) {
        return state;
      }

      return {
        windows: focusWindow(state.windows, action.appId),
        activeAppId: action.appId,
      };
    }

    case "close": {
      const windows = state.windows.filter((item) => item.appId !== action.appId);

      if (windows.length === state.windows.length) {
        return state;
      }

      return {
        windows,
        activeAppId:
          state.activeAppId === action.appId
            ? (windows.at(-1)?.appId ?? null)
            : state.activeAppId,
      };
    }

    case "move": {
      if (!state.windows.some((item) => item.appId === action.appId)) {
        return state;
      }

      return {
        windows: state.windows.map((item) => {
          if (item.appId !== action.appId || item.isMaximized) {
            return item;
          }

          return {
            ...item,
            geometry: clampWindowGeometry(
              item.geometry,
              action.x,
              action.y,
              action.bounds,
            ),
          };
        }),
        activeAppId: action.appId,
      };
    }

    case "maximize": {
      if (!state.windows.some((item) => item.appId === action.appId)) {
        return state;
      }

      return {
        windows: focusWindow(
          state.windows.map((item) =>
            item.appId === action.appId && !item.isMaximized
              ? {
                  ...item,
                  geometry: maximizedGeometry(action.bounds),
                  restoreGeometry: item.geometry,
                  isMaximized: true,
                }
              : item,
          ),
          action.appId,
        ),
        activeAppId: action.appId,
      };
    }

    case "restore": {
      if (!state.windows.some((item) => item.appId === action.appId)) {
        return state;
      }

      return {
        windows: focusWindow(
          state.windows.map((item) =>
            item.appId === action.appId && item.restoreGeometry
              ? {
                  ...item,
                  geometry: item.restoreGeometry,
                  restoreGeometry: null,
                  isMaximized: false,
                }
              : item,
          ),
          action.appId,
        ),
        activeAppId: action.appId,
      };
    }
  }
}
