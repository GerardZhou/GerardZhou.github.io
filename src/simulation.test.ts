import { describe, expect, it } from "vitest";

import {
  DEFAULT_SIMULATION_SEED,
  SIMULATION_LIMITS,
  normalizeSimulationInput,
  simulateQueue,
  type SimulationInput,
} from "./simulation";

// Most tests share a realistic, comfortably stable workload. Individual tests
// override only the variable whose behavior they are trying to demonstrate.
const baseline: SimulationInput = {
  arrivalRate: 420,
  serviceCapacity: 650,
  retryProbability: 0.08,
  sampleCount: 2_000,
};

// This group protects the boundary between UI/runtime data and the model. If
// these tests fail, unexpected values could leak into the math and produce NaN,
// an excessive run size, or controls that disagree with the displayed result.
describe("normalizeSimulationInput", () => {
  it("preserves supported values and rounds the request count", () => {
    expect(
      normalizeSimulationInput({
        arrivalRate: 350.5,
        serviceCapacity: 700.25,
        retryProbability: 0.17,
        sampleCount: 1_234.6,
      }),
    ).toEqual({
      arrivalRate: 350.5,
      serviceCapacity: 700.25,
      retryProbability: 0.17,
      sampleCount: 1_235,
    });
  });

  it("clamps values outside every supported range", () => {
    expect(
      normalizeSimulationInput({
        arrivalRate: -10,
        serviceCapacity: Number.POSITIVE_INFINITY,
        retryProbability: 4,
        sampleCount: -1,
      }),
    ).toEqual({
      arrivalRate: SIMULATION_LIMITS.arrivalRate.min,
      serviceCapacity: SIMULATION_LIMITS.serviceCapacity.max,
      retryProbability: SIMULATION_LIMITS.retryProbability.max,
      sampleCount: SIMULATION_LIMITS.sampleCount.min,
    });
  });

  it("uses safe defaults for NaN runtime input", () => {
    expect(
      normalizeSimulationInput({
        arrivalRate: Number.NaN,
        serviceCapacity: Number.NaN,
        retryProbability: Number.NaN,
        sampleCount: Number.NaN,
      }),
    ).toEqual({
      arrivalRate: SIMULATION_LIMITS.arrivalRate.default,
      serviceCapacity: SIMULATION_LIMITS.serviceCapacity.default,
      retryProbability: SIMULATION_LIMITS.retryProbability.default,
      sampleCount: SIMULATION_LIMITS.sampleCount.default,
    });
  });
});

// This group protects the simulation's observable contract: reproducibility,
// retry semantics, queue behavior, summary metrics, and bounded chart data.
// The tests intentionally assert outcomes rather than private helper details so
// the implementation can be refactored without weakening its guarantees.
describe("simulateQueue", () => {
  // Seed tests make experiments debuggable: one seed must replay exactly, while
  // another seed should sample a genuinely different run.
  it("is exactly reproducible for the same input and seed", () => {
    expect(simulateQueue(baseline, 42)).toEqual(simulateQueue(baseline, 42));
  });

  it("changes the sampled run when the seed changes", () => {
    const first = simulateQueue(baseline, 41);
    const second = simulateQueue(baseline, 42);

    expect(first.metrics.p95LatencyMs).not.toBe(second.metrics.p95LatencyMs);
    expect(first.series).not.toEqual(second.series);
  });

  it("normalizes invalid seeds to the documented default", () => {
    const invalidSeed = simulateQueue(baseline, Number.NaN);
    const defaultSeed = simulateQueue(baseline, DEFAULT_SIMULATION_SEED);

    expect(invalidSeed.seed).toBe(DEFAULT_SIMULATION_SEED);
    expect(invalidSeed).toEqual(defaultSeed);
  });

  // Probabilities 0 and 1 are useful model boundaries. Together these tests
  // protect the "at most one retry" rule and distinguish attempts from requests.
  it("produces no retries or terminal failures when attempt failure is zero", () => {
    const result = simulateQueue({ ...baseline, retryProbability: 0 }, 7);

    expect(result.metrics.retryAttempts).toBe(0);
    expect(result.metrics.failedRequests).toBe(0);
    expect(result.metrics.failureRate).toBe(0);
    expect(result.metrics.completedRequests).toBe(result.input.sampleCount);
  });

  it("retries once and terminally fails every request at probability one", () => {
    const result = simulateQueue(
      {
        arrivalRate: 100,
        serviceCapacity: 500,
        retryProbability: 1,
        sampleCount: 200,
      },
      7,
    );

    expect(result.metrics.retryAttempts).toBe(200);
    expect(result.metrics.failedRequests).toBe(200);
    expect(result.metrics.completedRequests).toBe(0);
    expect(result.metrics.failureRate).toBe(1);
    expect(result.metrics.throughput).toBe(0);
  });

  it("models terminal failure as two failed attempts", () => {
    const result = simulateQueue(
      {
        arrivalRate: 300,
        serviceCapacity: 900,
        retryProbability: 0.2,
        sampleCount: 10_000,
      },
      123,
    );

    // A terminal failure requires two independent failures, so its expected
    // probability is p * p rather than the per-attempt probability p.
    expect(result.metrics.failureRate).toBeCloseTo(0.2 ** 2, 2);
  });

  // Table-driven cases pin the exact 80% and 100% utilization boundaries,
  // where an off-by-one comparison would change the label shown in the UI.
  it.each([
    { arrivalRate: 79, serviceCapacity: 100, expected: "stable" },
    { arrivalRate: 80, serviceCapacity: 100, expected: "strained" },
    { arrivalRate: 100, serviceCapacity: 100, expected: "overloaded" },
  ] as const)(
    "classifies $arrivalRate/$serviceCapacity offered load as $expected",
    ({ arrivalRate, serviceCapacity, expected }) => {
      const result = simulateQueue(
        { arrivalRate, serviceCapacity, retryProbability: 0, sampleCount: 200 },
        99,
      );

      expect(result.metrics.utilization).toBe(arrivalRate / serviceCapacity);
      expect(result.metrics.stability).toBe(expected);
    },
  );

  // This is a behavioral sanity check for the queue model: overload should
  // create a pronounced waiting-time tail, not merely change a status label.
  it("shows tail-latency growth when offered demand exceeds capacity", () => {
    const stable = simulateQueue(
      { arrivalRate: 250, serviceCapacity: 800, retryProbability: 0.05, sampleCount: 4_000 },
      2026,
    );
    const overloaded = simulateQueue(
      { arrivalRate: 850, serviceCapacity: 600, retryProbability: 0.25, sampleCount: 4_000 },
      2026,
    );

    expect(stable.metrics.stability).toBe("stable");
    expect(overloaded.metrics.stability).toBe("overloaded");
    expect(overloaded.metrics.p95LatencyMs).toBeGreaterThan(stable.metrics.p95LatencyMs * 10);
  });

  // The chart contract stays deliberately small even when the model processes
  // thousands of requests. Histogram totals must still represent every request.
  it("returns finite summary values and bounded visualization data", () => {
    const result = simulateQueue(baseline, 101);
    const histogramCount = result.histogram.reduce((sum, bin) => sum + bin.count, 0);
    const histogramShare = result.histogram.reduce((sum, bin) => sum + bin.share, 0);

    expect(Object.values(result.metrics).filter((value) => typeof value === "number")).toEqual(
      expect.arrayContaining([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]),
    );
    for (const value of Object.values(result.metrics)) {
      if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
    }
    expect(result.histogram).toHaveLength(12);
    expect(histogramCount).toBe(result.input.sampleCount);
    expect(histogramShare).toBeCloseTo(1, 10);
    expect(result.series).toHaveLength(96);
    expect(result.series[0]?.requestNumber).toBe(1);
    expect(result.series.at(-1)?.requestNumber).toBe(result.input.sampleCount);
  });

  // Exercise the harshest supported input combination to catch numeric edge
  // cases that a normal workload might hide (negative, infinite, or invalid data).
  it("keeps every latency non-negative and every histogram share bounded", () => {
    const result = simulateQueue(
      {
        arrivalRate: SIMULATION_LIMITS.arrivalRate.max,
        serviceCapacity: SIMULATION_LIMITS.serviceCapacity.min,
        retryProbability: 1,
        sampleCount: SIMULATION_LIMITS.sampleCount.min,
      },
      0,
    );

    expect(result.metrics.p50LatencyMs).toBeGreaterThanOrEqual(0);
    expect(result.metrics.p95LatencyMs).toBeGreaterThanOrEqual(result.metrics.p50LatencyMs);
    expect(result.series.every((point) => point.latencyMs >= 0)).toBe(true);
    expect(result.histogram.every((bin) => bin.share >= 0 && bin.share <= 1)).toBe(true);
  });
});
