import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { workbenchAppById } from "./appRegistry";
import type {
  DesktopBounds,
  DesktopWindowState,
  WorkbenchAppId,
} from "./types";

interface DesktopWindowProps {
  bounds: DesktopBounds;
  children: ReactNode;
  isActive: boolean;
  state: DesktopWindowState;
  zIndex: number;
  onClose: (appId: WorkbenchAppId) => void;
  onFocus: (appId: WorkbenchAppId) => void;
  onMaximize: (appId: WorkbenchAppId) => void;
  onMove: (appId: WorkbenchAppId, x: number, y: number) => void;
  onRestore: (appId: WorkbenchAppId) => void;
}

interface DragSession {
  readonly pointerId: number;
  readonly startPointerX: number;
  readonly startPointerY: number;
}

export function DesktopWindow({
  bounds,
  children,
  isActive,
  state,
  zIndex,
  onClose,
  onFocus,
  onMaximize,
  onMove,
  onRestore,
}: DesktopWindowProps) {
  const definition = workbenchAppById[state.appId];
  const dragSession = useRef<DragSession | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [visualOffset, setVisualOffset] = useState({ x: 0, y: 0 });

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (state.isMaximized || event.button !== 0) {
      return;
    }

    onFocus(state.appId);
    dragSession.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
    };
    dragOffset.current = { x: 0, y: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragWindow(event: ReactPointerEvent<HTMLDivElement>) {
    const session = dragSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    const nextOffset = {
      x: event.clientX - session.startPointerX,
      y: event.clientY - session.startPointerY,
    };
    dragOffset.current = nextOffset;
    setVisualOffset(nextOffset);
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const session = dragSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    onMove(
      state.appId,
      state.geometry.x + dragOffset.current.x,
      state.geometry.y + dragOffset.current.y,
    );
    dragSession.current = null;
    dragOffset.current = { x: 0, y: 0 };
    setVisualOffset({ x: 0, y: 0 });
  }

  const style = {
    "--window-height": `${Math.min(state.geometry.height, bounds.height - 8)}px`,
    "--window-width": `${Math.min(state.geometry.width, bounds.width - 8)}px`,
    height: Math.min(state.geometry.height, bounds.height - 8),
    left: state.geometry.x,
    top: state.geometry.y,
    transform: `translate3d(${visualOffset.x}px, ${visualOffset.y}px, 0)`,
    width: Math.min(state.geometry.width, bounds.width - 8),
    zIndex,
  } as CSSProperties;

  return (
    <section
      aria-label={`${definition.label} window`}
      className={`wb-window${isActive ? " is-active" : ""}`}
      onPointerDown={() => onFocus(state.appId)}
      style={style}
    >
      <header className="wb-window-bar">
        <div className="wb-window-controls">
          <button
            aria-label={`Close ${definition.label}`}
            className="wb-window-close"
            onClick={() => onClose(state.appId)}
            type="button"
          />
          <button
            aria-label={state.isMaximized ? `Restore ${definition.label}` : `Maximize ${definition.label}`}
            className="wb-window-maximize"
            onClick={() =>
              state.isMaximized ? onRestore(state.appId) : onMaximize(state.appId)
            }
            type="button"
          />
        </div>
        <div
          className="wb-window-drag-region"
          onDoubleClick={() =>
            state.isMaximized ? onRestore(state.appId) : onMaximize(state.appId)
          }
          onPointerCancel={finishDrag}
          onPointerDown={startDrag}
          onPointerMove={dragWindow}
          onPointerUp={finishDrag}
        >
          <span>{definition.label}</span>
        </div>
        <span aria-hidden="true" className="wb-window-status">
          {isActive ? "active" : "idle"}
        </span>
      </header>
      <div className="wb-window-content">{children}</div>
    </section>
  );
}
