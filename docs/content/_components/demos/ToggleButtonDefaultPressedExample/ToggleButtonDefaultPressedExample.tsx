import { useState } from "react";
import { ToggleButton } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleButtonDefaultPressedExample() {
  const [bypassed, setBypassed] = useState(true);

  return (
    <div className={styles.root} data-variant="toggle-button">
      <span className={styles.label}>Default pressed</span>
      <div className={styles.togglePanel}>
        <ToggleButton.Root
          className={styles.toggleButton}
          defaultPressed
          onPressedChange={setBypassed}
        >
          Bypass
        </ToggleButton.Root>
      </div>
      <output className={styles.readout}>{bypassed ? "Bypassed" : "Active"}</output>
    </div>
  );
}
