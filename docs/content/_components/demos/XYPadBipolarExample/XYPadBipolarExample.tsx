import { useState } from "react";
import { XYPad } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function XYPadBipolarExample() {
  const [value, setValue] = useState({ x: -0.4, y: 0.6 });

  return (
    <div className={styles.root} data-variant="xypad">
      <span className={styles.label}>Bipolar</span>
      <XYPad.Root
        className={styles.xypad}
        defaultValue={{ x: -0.4, y: 0.6 }}
        maxX={1}
        maxY={1}
        minX={-1}
        minY={-1}
        onValueChange={setValue}
        stepX={0.01}
        stepY={0.01}
        value={value}
      >
        <XYPad.Area className={styles.xypadArea}>
          <span className={styles.xypadCrosshair} aria-hidden="true" />
          <XYPad.Thumb aria-label="Pan and width" className={styles.xypadThumb} />
        </XYPad.Area>
        <XYPad.Value
          className={styles.readout}
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
