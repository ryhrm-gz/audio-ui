import { Knob } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function KnobReadOnlyExample() {
  return (
    <div className={styles.root} data-variant="knob">
      <span className={styles.label}>Read only</span>
      <Knob.Root className={styles.knob} defaultValue={0.7} max={1} min={0} readOnly step={0.01}>
        <Knob.Control aria-label="Send" className={styles.knobControl}>
          <Knob.Thumb className={styles.knobThumb} />
        </Knob.Control>
        <Knob.Value
          className={styles.readout}
          format={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />
      </Knob.Root>
    </div>
  );
}
