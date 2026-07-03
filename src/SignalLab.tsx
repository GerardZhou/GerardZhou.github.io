import { useId, useMemo, useState } from "react";

import {
  DEFAULT_SIMULATION_SEED,
  SIMULATION_LIMITS,
  simulateQueue,
  type HistogramBin,
  type SimulationMetrics,
  type Stability,
} from "./simulation";

// Keep the UI defaults tied to the simulation's public limits. That gives us one
// source of truth if the model's valid ranges change later.
const LAB_DEFAULTS = {
  arrivalRate: SIMULATION_LIMITS.arrivalRate.default,
  serviceCapacity: SIMULATION_LIMITS.serviceCapacity.default,
  retryProbability: SIMULATION_LIMITS.retryProbability.default,
  sampleCount: SIMULATION_LIMITS.sampleCount.default,
} as const;

// Intl.NumberFormat handles grouping, rounding, and percent conversion consistently.
// These instances live outside React components because they never depend on props or state.
const rateFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const latencyFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface RangeControlProps {
  // `id` links the visible label, help text, output, and native range input.
  id: string;
  label: string;
  valueLabel: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

/**
 * A reusable, accessible slider row.
 *
 * The parent owns the actual value (a "controlled input" in React terminology),
 * while this component translates browser input events into plain numbers.
 */
function RangeControl({
  id,
  label,
  valueLabel,
  description,
  min,
  max,
  step,
  value,
  onChange,
}: RangeControlProps) {
  // Deriving the help-text ID from the input ID keeps every relationship unique.
  const descriptionId = `${id}-description`;

  return (
    <div className="signal-lab-control">
      <div className="signal-lab-control-heading">
        <label htmlFor={id}>{label}</label>
        {/* `output` tells assistive technology that this text is the slider's result. */}
        <output htmlFor={id}>{valueLabel}</output>
      </div>
      <input
        // A label names the control; aria-describedby adds the longer explanation.
        aria-describedby={descriptionId}
        id={id}
        max={max}
        min={min}
        // HTML input values arrive as strings, even when the input type is "range".
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        step={step}
        type="range"
        value={value}
      />
      <p id={descriptionId}>{description}</p>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  detail: string;
  status?: Stability;
}

/** Renders one item inside the surrounding definition list of simulation metrics. */
function Metric({ label, value, detail, status }: MetricProps) {
  return (
    // `data-status` is optional presentation metadata; the metric remains readable without CSS.
    <div className="signal-lab-metric" data-status={status}>
      <dt>{label}</dt>
      <dd>{value}</dd>
      <dd className="signal-lab-metric-detail">{detail}</dd>
    </div>
  );
}

/**
 * Converts histogram data into an SVG that scales with its container.
 * The chart receives already-computed data, so it stays focused on presentation.
 */
function Histogram({ bins, metrics }: { bins: HistogramBin[]; metrics: SimulationMetrics }) {
  // React's useId creates collision-free IDs, even if multiple charts appear on one page.
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const chartWidth = 720;
  const chartHeight = 260;
  const margin = { top: 20, right: 18, bottom: 48, left: 48 };
  // The plotting area excludes space reserved for axes and labels.
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  // Every bin gets one equal-width slot; a small subtraction creates a visible gap.
  const slotWidth = plotWidth / bins.length;
  const barWidth = Math.max(1, slotWidth - 7);
  // A floor of 1 prevents division by zero when every bin is empty.
  const maxCount = Math.max(1, ...bins.map((bin) => bin.count));
  const overflowBin = bins.at(-1);

  return (
    <div className="signal-lab-chart-wrap">
      <svg
        // The title and description provide a text equivalent for screen-reader users.
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="signal-lab-chart"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <title id={titleId}>Terminal request latency distribution</title>
        <desc id={descriptionId}>
          Histogram of {rateFormatter.format(metrics.completedRequests + metrics.failedRequests)}
          simulated requests. Median latency is {formatLatency(metrics.p50LatencyMs)} and 95th
          percentile latency is {formatLatency(metrics.p95LatencyMs)}.
        </desc>

        {/* Fractions are normalized positions: 0 is the baseline, 1 is the tallest bar. */}
        {[0, 0.5, 1].map((fraction) => {
          // SVG y-coordinates increase downward, so the normalized fraction is inverted.
          const y = margin.top + plotHeight * (1 - fraction);
          return (
            <g className="signal-lab-gridline" key={fraction}>
              <line x1={margin.left} x2={chartWidth - margin.right} y1={y} y2={y} />
              <text dominantBaseline="middle" textAnchor="end" x={margin.left - 10} y={y}>
                {rateFormatter.format(maxCount * fraction)}
              </text>
            </g>
          );
        })}

        {bins.map((bin, index) => {
          // Scale each count relative to the largest bin, then anchor it to the baseline.
          const height = (bin.count / maxCount) * plotHeight;
          const x = margin.left + index * slotWidth + (slotWidth - barWidth) / 2;
          const y = margin.top + plotHeight - height;
          return (
            // Data-derived keys remain stable if React renders the chart again.
            <g className="signal-lab-bar" key={`${bin.lowerMs}-${bin.upperMs ?? "overflow"}`}>
              <rect height={height} rx="2" width={barWidth} x={x} y={y}>
                {/* A nested SVG title exposes exact values on hover and to assistive tools. */}
                <title>
                  {formatBinRange(bin)}: {rateFormatter.format(bin.count)} requests (
                  {percentFormatter.format(bin.share)})
                </title>
              </rect>
            </g>
          );
        })}

        <text className="signal-lab-axis-label" textAnchor="start" x={margin.left} y={238}>
          0 ms
        </text>
        <text
          className="signal-lab-axis-label"
          textAnchor="end"
          x={chartWidth - margin.right}
          y={238}
        >
          {overflowBin ? `${latencyFormatter.format(overflowBin.lowerMs)} ms+` : "latency"}
        </text>
        <text
          className="signal-lab-axis-title"
          textAnchor="middle"
          x={margin.left + plotWidth / 2}
          y={255}
        >
          arrival → terminal outcome latency (milliseconds)
        </text>
      </svg>
    </div>
  );
}

function getInterpretation(metrics: SimulationMetrics): string {
  const load = percentFormatter.format(metrics.utilization);

  // Keep explanatory copy derived from the same stability classification shown in the UI.
  if (metrics.stability === "stable") {
    return `At ${load} modeled load, the queue retains useful capacity headroom. Tail latency remains the metric to watch as retries rise.`;
  }
  if (metrics.stability === "strained") {
    return `At ${load} modeled load, small bursts or extra retries can create a persistent queue. P95 latency typically moves before throughput does.`;
  }
  return `At ${load} modeled load, expected attempt demand exceeds service capacity. The finite run completes, but its growing queue is not steady-state sustainable.`;
}

function formatLatency(milliseconds: number): string {
  if (milliseconds >= 1_000) return `${latencyFormatter.format(milliseconds / 1_000)} s`;
  return `${latencyFormatter.format(milliseconds)} ms`;
}

function formatBinRange(bin: HistogramBin): string {
  const lower = latencyFormatter.format(bin.lowerMs);
  if (bin.upperMs === null) return `${lower} ms and above`;
  return `${lower}–${latencyFormatter.format(bin.upperMs)} ms`;
}

export function SignalLab() {
  // Each slider owns one piece of state. Changing any value causes React to render a new run.
  const [arrivalRate, setArrivalRate] = useState<number>(LAB_DEFAULTS.arrivalRate);
  const [serviceCapacity, setServiceCapacity] = useState<number>(LAB_DEFAULTS.serviceCapacity);
  const [retryProbability, setRetryProbability] = useState<number>(
    LAB_DEFAULTS.retryProbability,
  );
  const [sampleCount, setSampleCount] = useState<number>(LAB_DEFAULTS.sampleCount);

  // Simulation is the expensive step, so reuse its result until an input changes. A fixed
  // seed means identical controls always produce identical output, which makes the lab teachable.
  const result = useMemo(
    () =>
      simulateQueue(
        { arrivalRate, serviceCapacity, retryProbability, sampleCount },
        DEFAULT_SIMULATION_SEED,
      ),
    [arrivalRate, retryProbability, sampleCount, serviceCapacity],
  );

  const metrics = result.metrics;
  // Reset all controlled inputs together instead of relying on the browser's form reset behavior.
  const reset = () => {
    setArrivalRate(LAB_DEFAULTS.arrivalRate);
    setServiceCapacity(LAB_DEFAULTS.serviceCapacity);
    setRetryProbability(LAB_DEFAULTS.retryProbability);
    setSampleCount(LAB_DEFAULTS.sampleCount);
  };

  return (
    // aria-labelledby makes the visible h2 the accessible name of this standalone section.
    <section className="signal-lab" id="signal-lab" aria-labelledby="signal-lab-title">
      <div className="signal-lab-heading">
        <div>
          <p className="signal-lab-kicker">Interactive portfolio lab · synthetic model</p>
          <h2 id="signal-lab-title">When does a healthy queue become fragile?</h2>
        </div>
        <p className="signal-lab-intro">
          Tune demand, capacity, and retry behavior to explore how queue pressure compounds into
          tail latency. This is a deterministic educational model—not work experience, production
          telemetry, or a performance claim.
        </p>
      </div>

      <div className="signal-lab-workbench">
        {/* Sliders update immediately; preventing submit avoids an accidental page reload. */}
        <form className="signal-lab-controls" onSubmit={(event) => event.preventDefault()}>
          <div className="signal-lab-controls-heading">
            <div>
              <p className="signal-lab-panel-label">Model inputs</p>
              <h3>Shape the workload</h3>
            </div>
            <button className="signal-lab-reset" onClick={reset} type="button">
              Reset
            </button>
          </div>

          <RangeControl
            description="New requests entering the shared queue each second."
            id="arrival-rate"
            label="Arrival rate"
            max={1_200}
            min={100}
            onChange={setArrivalRate}
            step={10}
            value={arrivalRate}
            valueLabel={`${rateFormatter.format(arrivalRate)} req/s`}
          />
          <RangeControl
            description="Total first-attempt and retry work the service can process per second."
            id="service-capacity"
            label="Service capacity"
            max={1_400}
            min={200}
            onChange={setServiceCapacity}
            step={25}
            value={serviceCapacity}
            valueLabel={`${rateFormatter.format(serviceCapacity)} attempts/s`}
          />
          <RangeControl
            description="Independent transient failure chance per attempt; one retry is allowed."
            id="retry-probability"
            label="Retry probability"
            max={50}
            min={0}
            // The slider displays 0–50, while the model expects a decimal probability.
            onChange={(value) => setRetryProbability(value / 100)}
            step={1}
            value={retryProbability * 100}
            valueLabel={percentFormatter.format(retryProbability)}
          />
          <RangeControl
            description="More samples smooth random variation but do not make the model real-world data."
            id="sample-count"
            label="Requests sampled"
            max={10_000}
            min={500}
            onChange={setSampleCount}
            step={500}
            value={sampleCount}
            valueLabel={rateFormatter.format(sampleCount)}
          />
        </form>

        <div className="signal-lab-output">
          <div className="signal-lab-output-heading">
            <div>
              <p className="signal-lab-panel-label">Deterministic run / seed 5EEDC0DE</p>
              <h3>Queue response</h3>
            </div>
            {/* Template interpolation selects the matching visual status class. */}
            <span className={`signal-lab-status signal-lab-status-${metrics.stability}`}>
              {metrics.stability}
            </span>
          </div>

          {/* A definition list expresses each label/value/detail group semantically. */}
          <dl className="signal-lab-metrics" aria-label="Simulation summary">
            <Metric
              detail="successful requests per simulated second"
              label="Throughput"
              value={`${rateFormatter.format(metrics.throughput)} req/s`}
            />
            <Metric
              detail="median terminal response time"
              label="P50 latency"
              value={formatLatency(metrics.p50LatencyMs)}
            />
            <Metric
              detail="tail terminal response time"
              label="P95 latency"
              value={formatLatency(metrics.p95LatencyMs)}
            />
            <Metric
              detail="requests failing both attempts"
              label="Failure rate"
              value={percentFormatter.format(metrics.failureRate)}
            />
            <Metric
              detail="expected demand ÷ attempt capacity"
              label="Offered load"
              status={metrics.stability}
              value={percentFormatter.format(metrics.utilization)}
            />
          </dl>

          <p className="signal-lab-interpretation" data-status={metrics.stability}>
            <span>Readout</span> {getInterpretation(metrics)}
          </p>

          <Histogram bins={result.histogram} metrics={metrics} />

          {/* The table is an expandable, non-visual alternative to reading the SVG chart. */}
          <details className="signal-lab-table-details">
            <summary>View latency data as a table</summary>
            <div className="signal-lab-table-wrap">
              <table>
                <caption>Terminal latency distribution for this synthetic run</caption>
                <thead>
                  <tr>
                    <th scope="col">Latency range</th>
                    <th scope="col">Requests</th>
                    <th scope="col">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {/* The null upper bound identifies the final open-ended overflow bin. */}
                  {result.histogram.map((bin) => (
                    <tr key={`${bin.lowerMs}-${bin.upperMs ?? "overflow"}`}>
                      <th scope="row">{formatBinRange(bin)}</th>
                      <td>{rateFormatter.format(bin.count)}</td>
                      <td>{percentFormatter.format(bin.share)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>

      <div className="signal-lab-notes">
        <article>
          <p className="signal-lab-panel-label">Method</p>
          <h3>What the model does</h3>
          <p>
            A seeded pseudo-random run generates Poisson arrivals and exponential service times
            for one aggregate FCFS queue. A transiently failed request may rejoin once; every
            attempt consumes shared capacity. Latency covers arrival through final success or
            failure. Offered load below 80% is labeled stable, 80–99% strained, and 100% or more
            overloaded.
          </p>
        </article>
        <article>
          <p className="signal-lab-panel-label">Limits</p>
          <h3>What it cannot prove</h3>
          <p>
            This intentionally small model omits networks, caches, concurrency pools, correlated
            failures, autoscaling, and real traffic traces. It demonstrates reasoning about
            tradeoffs—not the behavior of any employer system or a production benchmark.
          </p>
        </article>
      </div>
    </section>
  );
}

export default SignalLab;
