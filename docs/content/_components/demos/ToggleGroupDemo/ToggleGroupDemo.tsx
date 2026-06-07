import { useState } from "react";
import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function ToggleGroupDemo() {
  const [filterMode, setFilterMode] = useState("lowpass");
  const [trackStates, setTrackStates] = useState<string[]>(["mute"]);

  return (
    <div className={styles.root} data-variant="toggle-group">
      <span className={styles.label}>Track mode</span>
      <div className={styles.toggleStack}>
        <ToggleGroup.Root
          className={styles.toggleGroup}
          name="filter-mode"
          onValueChange={(nextValue) => setFilterMode(nextValue as string)}
          type="single"
          value={filterMode}
        >
          <ToggleGroup.Item className={styles.toggleGroupItem} value="lowpass">
            LP
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="bandpass">
            BP
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="highpass">
            HP
          </ToggleGroup.Item>
          <ToggleGroup.HiddenInput />
        </ToggleGroup.Root>
        <ToggleGroup.Root
          className={styles.toggleGroup}
          name="track-state"
          onValueChange={(nextValue) => setTrackStates(nextValue as string[])}
          type="multiple"
          value={trackStates}
        >
          <ToggleGroup.Item className={styles.toggleGroupItem} value="mute">
            Mute
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="solo">
            Solo
          </ToggleGroup.Item>
          <ToggleGroup.Item className={styles.toggleGroupItem} value="arm">
            Arm
          </ToggleGroup.Item>
          <ToggleGroup.HiddenInput />
        </ToggleGroup.Root>
      </div>
      <output className={styles.readout}>
        {filterMode.toUpperCase()} / {trackStates.length === 0 ? "Clear" : trackStates.join(" + ")}
      </output>
    </div>
  );
}
