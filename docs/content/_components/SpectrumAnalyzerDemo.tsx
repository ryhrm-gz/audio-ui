import { SpectrumAnalyzer } from "@ryhrm-gz/audio-ui-react";

const minFrequency = 20;
const maxFrequency = 20000;

const spectrumBins = Array.from({ length: 512 }, (_, index) => {
  const percent = index / 511;
  const frequency = minFrequency * (maxFrequency / minFrequency) ** percent;
  const octave = Math.log2(frequency);
  const logPeak = (center: number, width: number, gain: number) =>
    gain * Math.exp(-0.5 * ((octave - Math.log2(center)) / width) ** 2);
  const texture =
    2.8 * Math.sin(index * 0.37) +
    1.7 * Math.sin(index * 0.91 + 1.4) +
    1.1 * Math.sin(index * 1.73 + 0.8);
  const rolloff = -13 * percent - Math.max(0, Math.log2(frequency / 12000)) * 9;
  const magnitude =
    -66 +
    rolloff +
    logPeak(56, 0.16, 30) +
    logPeak(92, 0.2, 22) +
    logPeak(145, 0.23, 15) +
    logPeak(230, 0.34, 16) -
    logPeak(360, 0.24, 8) +
    logPeak(760, 0.36, 11) +
    logPeak(1500, 0.28, 8) +
    logPeak(2600, 0.34, 17) +
    logPeak(4700, 0.2, 10) +
    logPeak(8700, 0.5, 13) +
    logPeak(13500, 0.34, 8) +
    texture;

  return {
    frequency,
    magnitude: Math.min(-4, Math.max(-78, magnitude)),
  };
});

export function SpectrumAnalyzerDemo() {
  return (
    <div className="audio-demo" data-variant="spectrum-analyzer">
      <span className="demo-label">Frequency spectrum</span>
      <SpectrumAnalyzer.Root
        aria-label="Mix spectrum"
        className="demo-spectrum-analyzer"
        maxFrequency={maxFrequency}
        maxMagnitude={0}
        minFrequency={minFrequency}
        minMagnitude={-78}
        name="mix-spectrum"
        value={spectrumBins}
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
