import { describe, expect, it } from "vitest";
import { runTerminalCommand, terminalCommandNames } from "./terminal";

describe("runTerminalCommand", () => {
  it("lists every available command", () => {
    const result = runTerminalCommand("help");

    expect(result.kind).toBe("output");
    expect(result.lines.join(" ")).toContain(terminalCommandNames.join("  "));
  });

  it("normalizes harmless whitespace and casing", () => {
    expect(runTerminalCommand("  PrOjEcTs  ")).toMatchObject({
      kind: "open-app",
      appId: "work",
    });
  });

  it("maps internal commands to reviewed workbench applications", () => {
    expect(runTerminalCommand("experience")).toMatchObject({
      kind: "open-app",
      appId: "experience",
    });
    expect(runTerminalCommand("lab")).toMatchObject({
      kind: "open-app",
      appId: "lab",
    });
  });

  it("returns reviewed external destinations instead of arbitrary URLs", () => {
    expect(runTerminalCommand("github")).toMatchObject({
      kind: "external",
      destination: "github",
    });
  });

  it("treats script-like text as an unknown inert command", () => {
    const result = runTerminalCommand('<script>alert("x")</script>');

    expect(result.kind).toBe("output");
    expect(result.lines[0]).toContain("Command not found");
  });

  it("signals history clearing without returning output", () => {
    expect(runTerminalCommand("clear")).toEqual({ kind: "clear", lines: [] });
  });

  it("allows empty input without an error", () => {
    expect(runTerminalCommand("   ")).toEqual({ kind: "output", lines: [] });
  });
});
