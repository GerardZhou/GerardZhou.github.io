import { type FormEvent, useId, useState } from "react";
import { externalLinks } from "../portfolioData";
import { runTerminalCommand } from "./terminal";
import type { WorkbenchAppId } from "./types";

interface TerminalEntry {
  readonly id: number;
  readonly input: string;
  readonly lines: readonly string[];
}

interface TerminalAppProps {
  onOpenApp: (appId: WorkbenchAppId) => void;
}

const externalHref = Object.fromEntries(
  externalLinks
    .filter((link) => link.id === "github" || link.id === "linkedin")
    .map((link) => [link.id, link.href]),
) as Record<"github" | "linkedin", string>;

export function TerminalApp({ onOpenApp }: TerminalAppProps) {
  const inputId = useId();
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<readonly TerminalEntry[]>([
    {
      id: 0,
      input: "",
      lines: ["GerardOS 1.0", "Type `help` to explore the portfolio."],
    },
  ]);

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = runTerminalCommand(input);

    if (result.kind === "clear") {
      setEntries([]);
      setInput("");
      return;
    }

    if (result.kind === "open-app") {
      onOpenApp(result.appId);
    }

    if (result.kind === "external") {
      // The parser can only return two reviewed destinations, never user input.
      window.open(externalHref[result.destination], "_blank", "noopener,noreferrer");
    }

    setEntries((current) => [
      ...current,
      { id: current.length ? current[current.length - 1]!.id + 1 : 1, input, lines: result.lines },
    ]);
    setInput("");
  }

  return (
    <div className="wb-terminal">
      <div aria-live="polite" className="wb-terminal-history">
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.input ? (
              <p className="wb-terminal-command">
                <span>gerard@portfolio:~$</span> {entry.input}
              </p>
            ) : null}
            {entry.lines.map((line, index) => (
              <p key={`${entry.id}-${index}`}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={submitCommand}>
        <label className="sr-only" htmlFor={inputId}>
          Terminal command
        </label>
        <span aria-hidden="true">gerard@portfolio:~$</span>
        <input
          autoComplete="off"
          id={inputId}
          onChange={(event) => setInput(event.target.value)}
          spellCheck="false"
          value={input}
        />
        <button type="submit">Run</button>
      </form>
    </div>
  );
}
