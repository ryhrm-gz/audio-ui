import { CompressorCurve } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

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
    <div className={styles.root} data-variant="compressor-curve">
      <span className={styles.label}>{label}</span>
      <CompressorCurve.Root
        className={styles.compressorCurve}
        curveResolution={96}
        stepKnee={0.5}
        stepMakeupGain={0.5}
        stepRatio={0.1}
        stepThreshold={0.5}
        value={value}
      >
        <CompressorCurve.Graph className={styles.compressorGraph}>
          <CompressorCurve.Grid className={styles.compressorGrid} />
          <CompressorCurve.Curve className={styles.compressorLine} />
        </CompressorCurve.Graph>
        <CompressorCurve.Value
          className={styles.readout}
          format={(nextValue) =>
            `${nextValue.threshold.toFixed(1)} dB / ${nextValue.ratio.toFixed(1)}:1 / knee ${nextValue.knee.toFixed(1)} dB / makeup ${nextValue.makeupGain.toFixed(1)} dB`
          }
        />
      </CompressorCurve.Root>
    </div>
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
