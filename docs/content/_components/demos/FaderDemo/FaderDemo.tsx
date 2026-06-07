import { useState } from "react";
import { Fader } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function FaderDemo() {
  const [value, setValue] = useState(-6);

  return (
    <div className={styles.root} data-variant="fader">
      <span className={styles.label}>Level</span>
      <Fader.Root className={styles.fader} defaultValue={-6} onValueChange={setValue} value={value}>
        <div className={styles.faderStrip}>
          <Fader.Scale className={styles.faderScale} />
          <Fader.Track className={styles.faderTrack}>
            <Fader.Range className={styles.faderRange} />
            <Fader.Thumb aria-label="Channel gain" className={styles.faderThumb} />
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
