import { useState } from "react";
import { XYPad } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function XYPadCoarseStepsExample() {
  const [value, setValue] = useState({ x: 4, y: 12 });

  return (
    <div className={styles.root} data-variant="xypad">
      <span className={styles.label}>Coarse steps</span>
      <XYPad.Root
        className={styles.xypad}
        defaultValue={{ x: 4, y: 12 }}
        maxX={16}
        maxY={16}
        minX={0}
        minY={0}
        onValueChange={setValue}
        stepX={4}
        stepY={4}
        value={value}
      >
        <XYPad.Area className={styles.xypadArea}>
          <span className={styles.xypadCrosshair} aria-hidden="true" />
          <XYPad.Thumb aria-label="Macro position" className={styles.xypadThumb} />
        </XYPad.Area>
        <XYPad.Value
          className={styles.readout}
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
