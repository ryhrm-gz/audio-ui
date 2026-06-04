import { SpectrumAnalyzer } from "@ryhrm-gz/audio-ui-react";
import { spectrumBins } from "./spectrum-data.ts";

function filterBins(min: number, max: number) {
  return spectrumBins.filter((bin) => bin.frequency >= min && bin.frequency <= max);
}

function SpectrumExample({
  ariaLabel,
  bins,
  frequencyScale = "log" as const,
  label,
  maxFrequency = 20000,
  maxMagnitude = 0,
  minFrequency = 20,
  minMagnitude = -78,
}: {
  ariaLabel: string;
  bins: typeof spectrumBins;
  frequencyScale?: "log" | "linear";
  label: string;
  maxFrequency?: number;
  maxMagnitude?: number;
  minFrequency?: number;
  minMagnitude?: number;
}) {
  return (
    <div className="audio-demo" data-variant="spectrum-analyzer">
      <span className="demo-label">{label}</span>
      <SpectrumAnalyzer.Root
        aria-label={ariaLabel}
        className="demo-spectrum-analyzer"
        frequencyScale={frequencyScale}
        maxFrequency={maxFrequency}
        maxMagnitude={maxMagnitude}
        minFrequency={minFrequency}
        minMagnitude={minMagnitude}
        value={bins}
      >
        <SpectrumAnalyzer.Graph className="demo-spectrum-graph">
          <SpectrumAnalyzer.Bars className="demo-spectrum-bars" />
          <SpectrumAnalyzer.Curve className="demo-spectrum-curve" />
        </SpectrumAnalyzer.Graph>
        <SpectrumAnalyzer.Value
          className="demo-readout demo-spectrum-readout"
          format={(peak) =>
            peak === null
              ? "No spectrum data"
              : `${peak.magnitude.toFixed(1)} dB @ ${Math.round(peak.frequency)} Hz`
          }
        />
      </SpectrumAnalyzer.Root>
    </div>
  );
}

export function SpectrumVocalRangeExample() {
  return (
    <SpectrumExample
      ariaLabel="Vocal spectrum"
      bins={filterBins(80, 12000)}
      label="Vocal range"
      maxFrequency={12000}
      minFrequency={80}
    />
  );
}

export function SpectrumBassFocusExample() {
  return (
    <SpectrumExample
      ariaLabel="Bass spectrum"
      bins={filterBins(30, 4000)}
      label="Bass focus"
      maxFrequency={4000}
      minFrequency={30}
      minMagnitude={-72}
    />
  );
}

export function SpectrumEmptyValueExample() {
  return (
    <SpectrumExample
      ariaLabel="Empty spectrum"
      bins={[]}
      frequencyScale="linear"
      label="Empty value"
    />
  );
}
