import { CompressorCurve } from "@ryhrm-gz/audio-ui-react";

const initialValue = {
  threshold: -24,
  ratio: 4,
  knee: 8,
  makeupGain: 3,
} as const;

export function CompressorCurveDemo() {
  return (
    <div className="audio-demo" data-variant="compressor-curve">
      <span className="demo-label">Compressor curve</span>
      <CompressorCurve.Root
        className="demo-compressor-curve"
        curveResolution={96}
        name="bus-compressor"
        stepKnee={0.5}
        stepMakeupGain={0.5}
        stepRatio={0.1}
        stepThreshold={0.5}
        value={initialValue}
      >
        <CompressorCurve.Graph className="demo-compressor-graph">
          <CompressorCurve.Grid className="demo-compressor-grid" />
          <CompressorCurve.Curve className="demo-compressor-line" />
        </CompressorCurve.Graph>
        <CompressorCurve.Value
          className="demo-readout demo-compressor-readout"
          format={(nextValue) =>
            `${nextValue.threshold.toFixed(1)} dB / ${nextValue.ratio.toFixed(1)}:1 / knee ${nextValue.knee.toFixed(1)} dB / makeup ${nextValue.makeupGain.toFixed(1)} dB`
          }
        />
        <CompressorCurve.HiddenInput />
      </CompressorCurve.Root>
    </div>
  );
}
