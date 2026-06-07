import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleGroupDisabledExample() {
  return (
    <div className={styles.root} data-variant="toggle-group">
      <span className={styles.label}>Disabled</span>
      <div className={styles.toggleStack}>
        <ToggleGroup.Root className={styles.toggleGroup} disabled type="single" value="lowpass">
          <ToggleGroup.Item className={styles.toggleGroupItem} value="lowpass">
            LP
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="highpass">
            HP
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className={styles.readout} data-muted="true">
        Locked
      </output>
    </div>
  );
}
