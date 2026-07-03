import type { WorkbenchAppId } from "./types";

export type ExternalDestination = "github" | "linkedin";

export type TerminalResult =
  | Readonly<{ kind: "output"; lines: readonly string[] }>
  | Readonly<{ kind: "clear"; lines: readonly [] }>
  | Readonly<{
      kind: "open-app";
      appId: WorkbenchAppId;
      lines: readonly string[];
    }>
  | Readonly<{
      kind: "external";
      destination: ExternalDestination;
      lines: readonly string[];
    }>;

const availableCommands = [
  "help",
  "about",
  "projects",
  "experience",
  "skills",
  "lab",
  "contact",
  "github",
  "linkedin",
  "whoami",
  "ls",
  "clear",
] as const;

function openApp(appId: WorkbenchAppId, label: string): TerminalResult {
  return {
    kind: "open-app",
    appId,
    lines: [`Opening ${label}…`],
  };
}

/**
 * Parses a deliberately small command language. Input never reaches a shell,
 * URL constructor, HTML sink, or dynamic evaluator.
 */
export function runTerminalCommand(rawInput: string): TerminalResult {
  const command = rawInput.trim().toLowerCase();

  switch (command) {
    case "":
      return { kind: "output", lines: [] };
    case "help":
      return {
        kind: "output",
        lines: [
          "Available commands:",
          availableCommands.join("  "),
          "Tip: apps open inside the workbench; profile links open in a new tab.",
        ],
      };
    case "about":
      return openApp("about", "About");
    case "projects":
      return openApp("work", "Selected Work");
    case "experience":
      return openApp("experience", "Experience");
    case "skills":
      return openApp("skills", "Skills");
    case "lab":
      return openApp("lab", "Systems Lab");
    case "contact":
      return openApp("contact", "Contact");
    case "github":
      return {
        kind: "external",
        destination: "github",
        lines: ["Opening Gerard's GitHub profile…"],
      };
    case "linkedin":
      return {
        kind: "external",
        destination: "linkedin",
        lines: ["Opening Gerard's LinkedIn profile…"],
      };
    case "whoami":
      return {
        kind: "output",
        lines: [
          "Gerard Zhou",
          "Computer Science @ UT Austin",
          "Software engineering · infrastructure · distributed systems",
        ],
      };
    case "ls":
      return {
        kind: "output",
        lines: ["about/  projects/  experience/  skills/  systems-lab/  contact/"],
      };
    case "clear":
      return { kind: "clear", lines: [] };
    default:
      return {
        kind: "output",
        lines: [`Command not found: ${rawInput.trim()}`, "Run `help` to see available commands."],
      };
  }
}

export const terminalCommandNames = availableCommands;
