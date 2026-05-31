import { useState } from "react";
import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";

export function ToggleGroupDemo() {
  const [filterMode, setFilterMode] = useState("lowpass");
  const [trackStates, setTrackStates] = useState<string[]>(["mute"]);

  return (
    <div className="audio-demo" data-variant="toggle-group">
      <span className="demo-label">Track mode</span>
      <div className="demo-toggle-stack">
        <ToggleGroup.Root
          className="demo-toggle-group"
          name="filter-mode"
          onValueChange={(nextValue) => setFilterMode(nextValue as string)}
          type="single"
          value={filterMode}
        >
          <ToggleGroup.Item className="demo-toggle-group-item" value="lowpass">
            LP
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="bandpass">
            BP
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="highpass">
            HP
          </ToggleGroup.Item>
          <ToggleGroup.HiddenInput />
        </ToggleGroup.Root>
        <ToggleGroup.Root
          className="demo-toggle-group"
          name="track-state"
          onValueChange={(nextValue) => setTrackStates(nextValue as string[])}
          type="multiple"
          value={trackStates}
        >
          <ToggleGroup.Item className="demo-toggle-group-item" value="mute">
            Mute
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="solo">
            Solo
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="arm">
            Arm
          </ToggleGroup.Item>
          <ToggleGroup.HiddenInput />
        </ToggleGroup.Root>
      </div>
      <output className="demo-readout">
        {filterMode.toUpperCase()} / {trackStates.length === 0 ? "Clear" : trackStates.join(" + ")}
      </output>
    </div>
  );
}
