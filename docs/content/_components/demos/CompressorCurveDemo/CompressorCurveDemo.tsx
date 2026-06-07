import { CompressorCurve } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

const initialValue = {
  threshold: -24,
  ratio: 4,
  knee: 8,
  makeupGain: 3,
} as const;

export function CompressorCurveDemo() {
  return (
    <div className={styles.root} data-variant="compressor-curve">
      <span className={styles.label}>Compressor curve</span>
      <CompressorCurve.Root
        className={styles.compressorCurve}
        curveResolution={96}
        name="bus-compressor"
        stepKnee={0.5}
        stepMakeupGain={0.5}
        stepRatio={0.1}
        stepThreshold={0.5}
        value={initialValue}
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
        <CompressorCurve.HiddenInput />
      </CompressorCurve.Root>
    </div>
  );
}
