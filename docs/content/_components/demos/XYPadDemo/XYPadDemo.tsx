import { useState } from "react";
import { XYPad } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function XYPadDemo() {
  const [value, setValue] = useState({ x: 20, y: 70 });

  return (
    <div className={styles.root} data-variant="xypad">
      <span className={styles.label}>Filter position</span>
      <XYPad.Root
        className={styles.xypad}
        defaultValue={{ x: 20, y: 70 }}
        maxX={100}
        maxY={100}
        minX={0}
        minY={0}
        onValueChange={setValue}
        stepX={1}
        stepY={1}
        value={value}
      >
        <XYPad.Area className={styles.xypadArea}>
          <span className={styles.xypadCrosshair} aria-hidden="true" />
          <XYPad.Thumb aria-label="Filter position" className={styles.xypadThumb} />
        </XYPad.Area>
        <XYPad.Value
          className={styles.readout}
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
