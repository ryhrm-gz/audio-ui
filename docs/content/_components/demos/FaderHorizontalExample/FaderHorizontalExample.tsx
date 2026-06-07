import { useState } from "react";
import { Fader } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function FaderHorizontalExample() {
  const [value, setValue] = useState(-12);

  return (
    <div className={styles.root} data-variant="fader">
      <span className={styles.label}>Horizontal</span>
      <Fader.Root
        className={styles.fader}
        defaultValue={-12}
        onValueChange={setValue}
        orientation="horizontal"
        value={value}
      >
        <div className={styles.faderStrip}>
          <Fader.Scale className={styles.faderScale} />
          <Fader.Track className={styles.faderTrack}>
            <Fader.Range className={styles.faderRange} />
            <Fader.Thumb aria-label="Bus gain" className={styles.faderThumb} />
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
