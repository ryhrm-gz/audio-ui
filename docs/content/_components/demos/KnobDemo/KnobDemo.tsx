import { useState } from "react";
import { Knob } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

function formatGainDb(value: number) {
  return value.toFixed(1);
}

export function KnobDemo() {
  const [value, setValue] = useState(-6);

  return (
    <div className={styles.root} data-variant="knob">
      <span className={styles.label}>Gain</span>
      <Knob.Root
        className={styles.knob}
        defaultValue={-6}
        max={12}
        min={-60}
        onValueChange={setValue}
        step={0.1}
        value={value}
      >
        <Knob.Scale className={styles.knobScale}>
          <Knob.Ticks className={styles.knobTicks} count={13} />
          <Knob.Mark className={styles.knobMark} value={-60}>
            <span className={styles.knobMarkLabel}>-inf</span>
          </Knob.Mark>
          <Knob.Mark className={styles.knobMark} value={0}>
            <span className={styles.knobMarkLabel}>0</span>
          </Knob.Mark>
          <Knob.Mark className={styles.knobMark} value={12}>
            <span className={styles.knobMarkLabel}>+12</span>
          </Knob.Mark>
        </Knob.Scale>
        <Knob.Control aria-label="Gain" className={styles.knobControl}>
          <Knob.Thumb className={styles.knobThumb} />
        </Knob.Control>
        <Knob.Value
          className={styles.readout}
          format={(nextValue) => (
            <>
              <span className={styles.knobReadoutValue}>{formatGainDb(nextValue)}</span>
              <span className={styles.knobReadoutUnit}>dB</span>
            </>
          )}
        />
      </Knob.Root>
    </div>
  );
}
