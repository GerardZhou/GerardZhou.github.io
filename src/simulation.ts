export const SIMULATION_LIMITS = {
  arrivalRate: { min: 25, max: 2_000, default: 420 },
  serviceCapacity: { min: 25, max: 2_000, default: 650 },
  retryProbability: { min: 0, max: 1, default: 0.08 },
  sampleCount: { min: 200, max: 20_000, default: 4_000 },
} as const;

// A fixed default seed makes the initial chart reproducible. Someone opening
// the page twice sees the same "random" experiment instead of a moving target.
export const DEFAULT_SIMULATION_SEED = 0x5eedc0de;

const HISTOGRAM_BIN_COUNT = 12;
const SERIES_SAMPLE_LIMIT = 96;

export interface SimulationInput {
  arrivalRate: number;
  serviceCapacity: number;
  retryProbability: number;
  sampleCount: number;
}

export type Stability = "stable" | "strained" | "overloaded";

export interface SimulationMetrics {
  throughput: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  failureRate: number;
  utilization: number;
  stability: Stability;
  completedRequests: number;
  failedRequests: number;
  retryAttempts: number;
  simulatedSeconds: number;
}

export interface SeriesPoint {
  requestNumber: number;
  arrivalTimeSeconds: number;
  latencyMs: number;
  failed: boolean;
}

export interface HistogramBin {
  lowerMs: number;
  upperMs: number | null;
  count: number;
  share: number;
}

export interface SimulationResult {
  input: SimulationInput;
  seed: number;
  metrics: SimulationMetrics;
  series: SeriesPoint[];
  histogram: HistogramBin[];
}

interface AttemptEvent {
  // An event represents work becoming eligible for the one shared server.
  // Retries are new events for the same request, not separate user requests.
  readyAt: number;
  requestIndex: number;
  attempt: 1 | 2;
  // sequence is a deterministic tie-breaker when two events have the same time.
  sequence: number;
}

interface TerminalRequest {
  requestNumber: number;
  arrivalTimeSeconds: number;
  latencyMs: number;
  failed: boolean;
}

/**
 * Clamp runtime input into the model's supported range. NaN and non-number
 * values use the documented defaults; infinities clamp to the nearest bound.
 */
export function normalizeSimulationInput(input: SimulationInput): SimulationInput {
  return {
    arrivalRate: normalizeNumber(
      input.arrivalRate,
      SIMULATION_LIMITS.arrivalRate.min,
      SIMULATION_LIMITS.arrivalRate.max,
      SIMULATION_LIMITS.arrivalRate.default,
    ),
    serviceCapacity: normalizeNumber(
      input.serviceCapacity,
      SIMULATION_LIMITS.serviceCapacity.min,
      SIMULATION_LIMITS.serviceCapacity.max,
      SIMULATION_LIMITS.serviceCapacity.default,
    ),
    retryProbability: normalizeNumber(
      input.retryProbability,
      SIMULATION_LIMITS.retryProbability.min,
      SIMULATION_LIMITS.retryProbability.max,
      SIMULATION_LIMITS.retryProbability.default,
    ),
    sampleCount: Math.round(
      normalizeNumber(
        input.sampleCount,
        SIMULATION_LIMITS.sampleCount.min,
        SIMULATION_LIMITS.sampleCount.max,
        SIMULATION_LIMITS.sampleCount.default,
      ),
    ),
  };
}

/**
 * Run a deterministic educational M/M/1-style queue simulation.
 *
 * Service capacity is measured in attempts per second. Each request may retry
 * once after a transient failure, so retries consume the same shared service
 * capacity as first attempts. Latency spans arrival through the final outcome.
 *
 * The model is "event driven": it jumps directly from one arrival/retry event
 * to the next rather than advancing a clock one millisecond at a time. That
 * keeps a run fast even when it represents thousands of requests.
 */
export function simulateQueue(
  rawInput: SimulationInput,
  rawSeed = DEFAULT_SIMULATION_SEED,
): SimulationResult {
  const input = normalizeSimulationInput(rawInput);
  const seed = normalizeSeed(rawSeed);
  const random = createSeededRandom(seed);
  const queue = new EventMinHeap();
  const arrivalTimes = new Array<number>(input.sampleCount);
  const requests = new Array<TerminalRequest>(input.sampleCount);

  let arrivalTime = 0;
  let sequence = 0;

  // First generate the original request arrivals. Exponential gaps model a
  // memoryless Poisson arrival process: arrivals are irregular, but their
  // long-run average matches input.arrivalRate.
  for (let requestIndex = 0; requestIndex < input.sampleCount; requestIndex += 1) {
    arrivalTime += exponentialInterval(random, input.arrivalRate);
    arrivalTimes[requestIndex] = arrivalTime;
    queue.push({ readyAt: arrivalTime, requestIndex, attempt: 1, sequence });
    sequence += 1;
  }

  let serverAvailableAt = 0;
  let failedRequests = 0;
  let retryAttempts = 0;

  // The min-heap always returns the attempt whose ready time is earliest. A
  // retry goes back into this same heap, so other already-ready work may run
  // before it. serverAvailableAt represents the single server's busy timeline.
  while (queue.size > 0) {
    const event = queue.pop();
    if (event === undefined) break;

    const serviceStartedAt = Math.max(event.readyAt, serverAvailableAt);
    const serviceDuration = exponentialInterval(random, input.serviceCapacity);
    const completedAt = serviceStartedAt + serviceDuration;
    serverAvailableAt = completedAt;

    const attemptFailed = random() < input.retryProbability;
    if (attemptFailed && event.attempt === 1) {
      // A first failure is transient: retry exactly once after that attempt
      // finishes. Because the retry is queued, it consumes real capacity and
      // can increase latency for every request behind it.
      retryAttempts += 1;
      queue.push({
        readyAt: completedAt,
        requestIndex: event.requestIndex,
        attempt: 2,
        sequence,
      });
      sequence += 1;
      continue;
    }

    // Reaching here means the request has a terminal outcome: either an
    // attempt succeeded or its one permitted retry also failed.
    const failed = attemptFailed;
    if (failed) failedRequests += 1;

    const originalArrival = arrivalTimes[event.requestIndex];
    requests[event.requestIndex] = {
      requestNumber: event.requestIndex + 1,
      arrivalTimeSeconds: originalArrival,
      latencyMs: Math.max(0, completedAt - originalArrival) * 1_000,
      failed,
    };
  }

  const latencies = requests.map((request) => request.latencyMs).sort((a, b) => a - b);
  const successfulRequests = input.sampleCount - failedRequests;
  const simulatedSeconds = Math.max(serverAvailableAt, Number.EPSILON);
  // Each request always needs one attempt and needs a second with probability
  // retryProbability. Thus arrivalRate * (1 + p) is the expected attempt load.
  const utilization =
    (input.arrivalRate * (1 + input.retryProbability)) / input.serviceCapacity;

  return {
    input,
    seed,
    metrics: {
      throughput: successfulRequests / simulatedSeconds,
      p50LatencyMs: quantile(latencies, 0.5),
      p95LatencyMs: quantile(latencies, 0.95),
      failureRate: failedRequests / input.sampleCount,
      utilization,
      stability: classifyStability(utilization),
      completedRequests: successfulRequests,
      failedRequests,
      retryAttempts,
      simulatedSeconds,
    },
    series: sampleSeries(requests, SERIES_SAMPLE_LIMIT),
    histogram: buildHistogram(latencies, HISTOGRAM_BIN_COUNT),
  };
}

function normalizeNumber(value: number, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function normalizeSeed(seed: number): number {
  if (typeof seed !== "number" || !Number.isFinite(seed)) return DEFAULT_SIMULATION_SEED;
  return Math.trunc(seed) >>> 0;
}

/**
 * Return a tiny seeded pseudo-random number generator.
 *
 * JavaScript's Math.random() cannot be seeded, which would make tests and the
 * portfolio demo change on every run. This generator maps the same 32-bit seed
 * to the same sequence in [0, 1). It is suitable for simulation, not security.
 */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function exponentialInterval(random: () => number, rate: number): number {
  // Inverse-transform sampling converts a uniform random value into an
  // exponentially distributed time gap with mean 1 / rate seconds.
  const sample = Math.max(random(), Number.EPSILON);
  return -Math.log1p(-sample) / rate;
}

function classifyStability(utilization: number): Stability {
  if (utilization < 0.8) return "stable";
  if (utilization < 1) return "strained";
  return "overloaded";
}

function quantile(sortedValues: number[], probability: number): number {
  if (sortedValues.length === 0) return 0;

  // A requested percentile often falls between two samples. Linear
  // interpolation avoids snapping p50/p95 to only one neighboring value.
  const position = (sortedValues.length - 1) * probability;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sortedValues[lowerIndex];
  const upper = sortedValues[upperIndex];

  if (lowerIndex === upperIndex) return lower;
  return lower + (upper - lower) * (position - lowerIndex);
}

function sampleSeries(requests: TerminalRequest[], limit: number): SeriesPoint[] {
  if (requests.length <= limit) return requests.map(toSeriesPoint);

  // Rendering every request would make the SVG noisy and unnecessarily large.
  // Evenly spaced indices keep the first and last request while giving a
  // representative view across the entire run.
  const sampled = new Array<SeriesPoint>(limit);
  const stride = (requests.length - 1) / (limit - 1);

  for (let index = 0; index < limit; index += 1) {
    sampled[index] = toSeriesPoint(requests[Math.round(index * stride)]);
  }

  return sampled;
}

function toSeriesPoint(request: TerminalRequest): SeriesPoint {
  return {
    requestNumber: request.requestNumber,
    arrivalTimeSeconds: request.arrivalTimeSeconds,
    latencyMs: request.latencyMs,
    failed: request.failed,
  };
}

function buildHistogram(sortedLatencies: number[], binCount: number): HistogramBin[] {
  // Use p99 as the top of the regular chart. Rare extreme values then land in
  // one open-ended overflow bin instead of stretching every useful bin.
  const regularBinCount = binCount - 1;
  const overflowThreshold = Math.max(quantile(sortedLatencies, 0.99), Number.EPSILON);
  const binWidth = overflowThreshold / regularBinCount;
  const bins = Array.from({ length: binCount }, (_, index): HistogramBin => {
    const isOverflow = index === regularBinCount;
    return {
      lowerMs: index * binWidth,
      upperMs: isOverflow ? null : (index + 1) * binWidth,
      count: 0,
      share: 0,
    };
  });

  for (const latency of sortedLatencies) {
    // Math.min routes p99-and-above values into the last overflow bin.
    const binIndex = Math.min(Math.floor(latency / binWidth), regularBinCount);
    bins[binIndex].count += 1;
  }

  for (const bin of bins) {
    bin.share = bin.count / sortedLatencies.length;
  }

  return bins;
}

/**
 * Priority queue ordered by event readiness.
 *
 * A binary min-heap stores the next event at index 0. Insertion and removal
 * each take O(log n), unlike repeatedly sorting all pending events. Children
 * of index i live at 2i + 1 and 2i + 2; bubbleUp and sinkDown restore that
 * ordering after the underlying array changes.
 */
class EventMinHeap {
  private readonly events: AttemptEvent[] = [];

  get size(): number {
    return this.events.length;
  }

  push(event: AttemptEvent): void {
    this.events.push(event);
    this.bubbleUp(this.events.length - 1);
  }

  pop(): AttemptEvent | undefined {
    if (this.events.length === 0) return undefined;

    const first = this.events[0];
    const last = this.events.pop();
    if (this.events.length > 0 && last !== undefined) {
      this.events[0] = last;
      this.sinkDown(0);
    }
    return first;
  }

  private bubbleUp(startIndex: number): void {
    let index = startIndex;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (!comesBefore(this.events[index], this.events[parentIndex])) break;
      [this.events[index], this.events[parentIndex]] = [
        this.events[parentIndex],
        this.events[index],
      ];
      index = parentIndex;
    }
  }

  private sinkDown(startIndex: number): void {
    let index = startIndex;

    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = leftIndex + 1;
      let nextIndex = index;

      if (
        leftIndex < this.events.length &&
        comesBefore(this.events[leftIndex], this.events[nextIndex])
      ) {
        nextIndex = leftIndex;
      }
      if (
        rightIndex < this.events.length &&
        comesBefore(this.events[rightIndex], this.events[nextIndex])
      ) {
        nextIndex = rightIndex;
      }
      if (nextIndex === index) return;

      [this.events[index], this.events[nextIndex]] = [
        this.events[nextIndex],
        this.events[index],
      ];
      index = nextIndex;
    }
  }
}

function comesBefore(left: AttemptEvent, right: AttemptEvent): boolean {
  if (left.readyAt !== right.readyAt) return left.readyAt < right.readyAt;
  // Preserve insertion order for equal timestamps so deterministic runs stay
  // deterministic across JavaScript engines and future refactors.
  return left.sequence < right.sequence;
}
