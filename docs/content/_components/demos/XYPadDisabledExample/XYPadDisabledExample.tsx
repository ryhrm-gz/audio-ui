import { XYPad } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function XYPadDisabledExample() {
  return (
    <div className={styles.root} data-variant="xypad">
      <span className={styles.label}>Disabled</span>
      <XYPad.Root
        className={styles.xypad}
        defaultValue={{ x: 50, y: 50 }}
        disabled
        maxX={100}
        maxY={100}
        minX={0}
        minY={0}
        stepX={1}
        stepY={1}
      >
        <XYPad.Area className={styles.xypadArea}>
          <span className={styles.xypadCrosshair} aria-hidden="true" />
          <XYPad.Thumb aria-label="Locked pad" className={styles.xypadThumb} />
        </XYPad.Area>
        <XYPad.Value
          className={styles.readout}
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
