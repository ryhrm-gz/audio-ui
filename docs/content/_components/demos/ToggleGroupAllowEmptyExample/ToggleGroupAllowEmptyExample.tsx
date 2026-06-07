import { useState } from "react";
import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleGroupAllowEmptyExample() {
  const [view, setView] = useState("");

  return (
    <div className={styles.root} data-variant="toggle-group">
      <span className={styles.label}>Allow empty</span>
      <div className={styles.toggleStack}>
        <ToggleGroup.Root
          allowEmpty
          className={styles.toggleGroup}
          onValueChange={(nextValue) => setView(nextValue as string)}
          type="single"
          value={view}
        >
          <ToggleGroup.Item className={styles.toggleGroupItem} value="mixer">
            Mixer
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="editor">
            Editor
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="browser">
            Browser
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className={styles.readout}>{view === "" ? "None" : view}</output>
    </div>
  );
}
