import { SpectrumAnalyzer } from "@ryhrm-gz/audio-ui-react";
import { spectrumBins } from "../../examples/spectrum-data.ts";
import styles from "./index.module.css";

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
    <div className={styles.root} data-variant="spectrum-analyzer">
      <span className={styles.label}>{label}</span>
      <SpectrumAnalyzer.Root
        aria-label={ariaLabel}
        className={styles.spectrumAnalyzer}
        frequencyScale={frequencyScale}
        maxFrequency={maxFrequency}
        maxMagnitude={maxMagnitude}
        minFrequency={minFrequency}
        minMagnitude={minMagnitude}
        value={bins}
      >
        <SpectrumAnalyzer.Graph className={styles.spectrumGraph}>
          <SpectrumAnalyzer.Bars className={styles.spectrumBars} />
          <SpectrumAnalyzer.Curve className={styles.spectrumCurve} />
        </SpectrumAnalyzer.Graph>
        <SpectrumAnalyzer.Value
          className={styles.readout}
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
