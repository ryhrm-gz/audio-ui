import { useState } from "react";
import { ToggleButton } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleButtonRenderStateExample() {
  const [armed, setArmed] = useState(true);

  return (
    <div className={styles.root} data-variant="toggle-button">
      <span className={styles.label}>Render state</span>
      <div className={styles.togglePanel}>
        <ToggleButton.Root
          className={styles.toggleButton}
          onPressedChange={setArmed}
          pressed={armed}
        >
          {(state) => (state.pressed ? "Armed" : "Arm")}
        </ToggleButton.Root>
      </div>
      <output className={styles.readout}>{armed ? "Recording" : "Standby"}</output>
    </div>
  );
}
