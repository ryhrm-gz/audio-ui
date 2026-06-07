import { useState } from "react";
import { ToggleButton } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleButtonDemo() {
  const [muted, setMuted] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  return (
    <div className={styles.root} data-variant="toggle-button">
      <span className={styles.label}>Channel controls</span>
      <div className={styles.togglePanel}>
        <ToggleButton.Root
          className={styles.toggleButton}
          name="mute"
          onPressedChange={setMuted}
          pressed={muted}
          value="on"
        >
          Mute
          <ToggleButton.HiddenInput />
        </ToggleButton.Root>
        <ToggleButton.Root
          className={styles.toggleButton}
          mode="momentary"
          onPressedChange={setPreviewing}
          pressed={previewing}
        >
          Preview
        </ToggleButton.Root>
      </div>
      <output className={styles.readout}>
        {muted ? "Muted" : previewing ? "Previewing" : "Live"}
      </output>
    </div>
  );
}
