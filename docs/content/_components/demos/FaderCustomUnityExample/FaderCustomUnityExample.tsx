import { useState } from "react";
import { Fader } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function FaderCustomUnityExample() {
  const [value, setValue] = useState(2);

  return (
    <div className={styles.root} data-variant="fader">
      <span className={styles.label}>Custom unity</span>
      <Fader.Root
        className={styles.fader}
        defaultValue={2}
        onValueChange={setValue}
        unity={2}
        value={value}
      >
        <div className={styles.faderStrip}>
          <Fader.Scale className={styles.faderScale} />
          <Fader.Track className={styles.faderTrack}>
            <Fader.Range className={styles.faderRange} />
            <Fader.Thumb aria-label="Aux send" className={styles.faderThumb} />
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
