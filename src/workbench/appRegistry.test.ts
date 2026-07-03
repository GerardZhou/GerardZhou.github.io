import { describe, expect, it } from "vitest";
import { workbenchAppById, workbenchApps } from "./appRegistry";

describe("workbench application registry", () => {
  it("keeps application IDs unique", () => {
    const ids = workbenchApps.map((app) => app.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides safe positive default geometry for every desktop window", () => {
    expect(
      workbenchApps.every(
        (app) =>
          app.defaultGeometry.width >= 320 &&
          app.defaultGeometry.height >= 240 &&
          app.defaultGeometry.x >= 0 &&
          app.defaultGeometry.y >= 0,
      ),
    ).toBe(true);
  });

  it("includes the default System Overview application", () => {
    expect(workbenchAppById.overview.label).toBe("System Overview");
  });

  it("does not expose the removed queue lab", () => {
    expect(Object.prototype.hasOwnProperty.call(workbenchAppById, "lab")).toBe(false);
  });
});
