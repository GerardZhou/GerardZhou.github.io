import { type RefCallback, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Dock } from "./Dock";
import { DesktopWindow } from "./DesktopWindow";
import { MobileCommandDeck } from "./MobileCommandDeck";
import { workbenchAppById } from "./appRegistry";
import type { DesktopBounds, WorkbenchAppId } from "./types";
import { WorkbenchAppContent } from "./WorkbenchAppContent";
import { initialWindowManagerState, windowManagerReducer } from "./windowManager";
import "./workbench.css";

const FALLBACK_BOUNDS: DesktopBounds = { width: 1000, height: 590 };

function createInitialState() {
  return windowManagerReducer(initialWindowManagerState, {
    type: "open",
    appId: "overview",
    geometry: workbenchAppById.overview.defaultGeometry,
  });
}

export function Workbench() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const launcherRefs = useRef<Partial<Record<WorkbenchAppId, HTMLButtonElement>>>({});
  const [bounds, setBounds] = useState<DesktopBounds>(FALLBACK_BOUNDS);
  const [state, dispatch] = useReducer(windowManagerReducer, undefined, createInitialState);

  useEffect(() => {
    const desktop = desktopRef.current;

    if (!desktop) {
      return undefined;
    }

    const updateBounds = () => {
      setBounds({ width: desktop.clientWidth, height: desktop.clientHeight });
    };
    updateBounds();

    const observer = new ResizeObserver(updateBounds);
    observer.observe(desktop);
    return () => observer.disconnect();
  }, []);

  const openApp = useCallback((appId: WorkbenchAppId) => {
    dispatch({
      type: "open",
      appId,
      geometry: workbenchAppById[appId].defaultGeometry,
    });
  }, []);

  const closeApp = useCallback((appId: WorkbenchAppId) => {
    dispatch({ type: "close", appId });
    // Focus is restored after React removes the window from the document.
    window.requestAnimationFrame(() => launcherRefs.current[appId]?.focus());
  }, []);

  const registerLauncher = useCallback(
    (appId: WorkbenchAppId): RefCallback<HTMLButtonElement> =>
      (element) => {
        if (element) {
          launcherRefs.current[appId] = element;
        } else {
          delete launcherRefs.current[appId];
        }
      },
    [],
  );

  const openAppIds = useMemo(
    () => new Set(state.windows.map((item) => item.appId)),
    [state.windows],
  );

  return (
    <section aria-labelledby="workbench-heading" className="workbench-section" id="workbench">
      <div className="workbench-heading-row">
        <div>
          <p className="section-number">04 / Interactive workbench</p>
          <h2 id="workbench-heading">Take the scenic route through my work.</h2>
        </div>
        <p>
          Open an app, move a window, or use the terminal. It is a playful way to explore
          the same evidence available throughout the page.
        </p>
      </div>

      <div className="macbook-stage">
        <div className="macbook-screen-shell">
          <div className="macbook-camera" aria-hidden="true" />
          <div className="workbench-desktop" ref={desktopRef}>
            <div className="wb-menu-bar">
              <strong>GerardOS</strong>
              <span>Engineering workbench</span>
              <small className="wb-menu-context">Austin · Computer Science @ UT Austin</small>
            </div>
            <div className="wb-wallpaper-copy" aria-hidden="true">
              <span>Gerard Zhou</span>
              <strong>systems / infrastructure / product</strong>
            </div>

            {state.windows.map((windowState, index) => (
              <DesktopWindow
                bounds={bounds}
                isActive={state.activeAppId === windowState.appId}
                key={windowState.appId}
                onClose={closeApp}
                onFocus={(appId) => dispatch({ type: "focus", appId })}
                onMaximize={(appId) => dispatch({ type: "maximize", appId, bounds })}
                onMove={(appId, x, y) =>
                  dispatch({ type: "move", appId, x, y, bounds })
                }
                onRestore={(appId) => dispatch({ type: "restore", appId })}
                state={windowState}
                zIndex={index + 2}
              >
                <WorkbenchAppContent appId={windowState.appId} onOpenApp={openApp} />
              </DesktopWindow>
            ))}

            <Dock
              activeAppId={state.activeAppId}
              onOpenApp={openApp}
              openAppIds={openAppIds}
              registerLauncher={registerLauncher}
            />
          </div>
        </div>
        <div className="macbook-base" aria-hidden="true">
          <span />
        </div>
      </div>

      <MobileCommandDeck />
    </section>
  );
}
