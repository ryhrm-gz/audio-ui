import { SpectrumAnalyzer } from "@ryhrm-gz/audio-ui-react";

const spectrumBins = [
  { id: "sub", frequency: 31.5, magnitude: -52 },
  { id: "kick", frequency: 63, magnitude: -28 },
  { id: "bass", frequency: 125, magnitude: -18 },
  { id: "low-mid", frequency: 250, magnitude: -24 },
  { id: "mid", frequency: 500, magnitude: -31 },
  { id: "vocal", frequency: 1000, magnitude: -16 },
  { id: "presence", frequency: 2000, magnitude: -12 },
  { id: "edge", frequency: 4000, magnitude: -21 },
  { id: "air", frequency: 8000, magnitude: -30 },
  { id: "sparkle", frequency: 16000, magnitude: -46 },
] as const;

export function SpectrumAnalyzerDemo() {
  return (
    <div className="audio-demo" data-variant="spectrum-analyzer">
      <span className="demo-label">Frequency spectrum</span>
      <SpectrumAnalyzer.Root
        aria-label="Mix spectrum"
        className="demo-spectrum-analyzer"
        maxMagnitude={0}
        minMagnitude={-60}
        name="mix-spectrum"
        value={[...spectrumBins]}
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
        <SpectrumAnalyzer.HiddenInput />
      </SpectrumAnalyzer.Root>
    </div>
  );
}
