import { ToggleButton } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleButtonDisabledExample() {
  return (
    <div className={styles.root} data-variant="toggle-button">
      <span className={styles.label}>Disabled</span>
      <div className={styles.togglePanel}>
        <ToggleButton.Root className={styles.toggleButton} defaultPressed disabled>
          Bypass
        </ToggleButton.Root>
      </div>
      <output className={styles.readout} data-muted="true">
        Locked
      </output>
    </div>
  );
}
