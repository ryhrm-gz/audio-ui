import { useState } from "react";
import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleGroupVerticalExample() {
  const [routing, setRouting] = useState("main");

  return (
    <div className={styles.root} data-variant="toggle-group">
      <span className={styles.label}>Vertical</span>
      <div className={styles.toggleStack}>
        <ToggleGroup.Root
          className={styles.toggleGroup}
          onValueChange={(nextValue) => setRouting(nextValue as string)}
          orientation="vertical"
          type="single"
          value={routing}
        >
          <ToggleGroup.Item className={styles.toggleGroupItem} value="main">
            Main
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="aux">
            Aux
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="cue">
            Cue
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className={styles.readout}>{routing}</output>
    </div>
  );
}
