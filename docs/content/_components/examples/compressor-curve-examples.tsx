import { CompressorCurve } from "@ryhrm-gz/audio-ui-react";

function CompressorExample({
  label,
  value,
}: {
  label: string;
  value: {
    threshold: number;
    ratio: number;
    knee: number;
    makeupGain: number;
  };
}) {
  return (
    <div className="audio-demo" data-variant="compressor-curve">
      <span className="demo-label">{label}</span>
      <CompressorCurve.Root
        className="demo-compressor-curve"
        curveResolution={96}
        stepKnee={0.5}
        stepMakeupGain={0.5}
        stepRatio={0.1}
        stepThreshold={0.5}
        value={value}
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
      </CompressorCurve.Root>
    </div>
  );
}

export function CompressorSoftKneeExample() {
  return (
    <CompressorExample
      label="Soft knee"
      value={{ threshold: -18, ratio: 2, knee: 14, makeupGain: 1.5 }}
    />
  );
}

export function CompressorLimiterExample() {
  return (
    <CompressorExample
      label="Limiter"
      value={{ threshold: -6, ratio: 20, knee: 1, makeupGain: 0 }}
    />
  );
}
