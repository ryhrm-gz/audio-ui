import { Fader } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function FaderReadOnlyExample() {
  return (
    <div className={styles.root} data-variant="fader">
      <span className={styles.label}>Read only</span>
      <Fader.Root className={styles.fader} defaultValue={-18} readOnly>
        <div className={styles.faderStrip}>
          <Fader.Scale className={styles.faderScale} />
          <Fader.Track className={styles.faderTrack}>
            <Fader.Range className={styles.faderRange} />
            <Fader.Thumb aria-label="Monitor level" className={styles.faderThumb} />
          </Fader.Track>
        </div>
        <Fader.Value
          className={styles.readout}
          format={(nextValue) => `${nextValue.toFixed(1)} dB`}
        />
      </Fader.Root>
    </div>
  );
}
