import { useState } from "react";
import { ToggleButton } from "@ryhrm-gz/audio-ui-react";

export function ToggleButtonDemo() {
  const [muted, setMuted] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  return (
    <div className="audio-demo" data-variant="toggle-button">
      <span className="demo-label">Channel controls</span>
      <div className="demo-toggle-panel">
        <ToggleButton.Root
          className="demo-toggle-button"
          name="mute"
          onPressedChange={setMuted}
          pressed={muted}
          value="on"
        >
          Mute
          <ToggleButton.HiddenInput />
        </ToggleButton.Root>
        <ToggleButton.Root
          className="demo-toggle-button"
          mode="momentary"
          onPressedChange={setPreviewing}
          pressed={previewing}
        >
          Preview
        </ToggleButton.Root>
      </div>
      <output className="demo-readout">
        {muted ? "Muted" : previewing ? "Previewing" : "Live"}
      </output>
    </div>
  );
}
