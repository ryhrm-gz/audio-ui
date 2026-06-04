import { useState } from "react";
import { ToggleButton } from "@ryhrm-gz/audio-ui-react";

export function ToggleButtonDefaultPressedExample() {
  const [bypassed, setBypassed] = useState(true);

  return (
    <div className="audio-demo" data-variant="toggle-button">
      <span className="demo-label">Default pressed</span>
      <div className="demo-toggle-panel">
        <ToggleButton.Root
          className="demo-toggle-button"
          defaultPressed
          onPressedChange={setBypassed}
        >
          Bypass
        </ToggleButton.Root>
      </div>
      <output className="demo-readout">{bypassed ? "Bypassed" : "Active"}</output>
    </div>
  );
}

export function ToggleButtonRenderStateExample() {
  const [armed, setArmed] = useState(true);

  return (
    <div className="audio-demo" data-variant="toggle-button">
      <span className="demo-label">Render state</span>
      <div className="demo-toggle-panel">
        <ToggleButton.Root
          className="demo-toggle-button"
          onPressedChange={setArmed}
          pressed={armed}
        >
          {(state) => (state.pressed ? "Armed" : "Arm")}
        </ToggleButton.Root>
      </div>
      <output className="demo-readout">{armed ? "Recording" : "Standby"}</output>
    </div>
  );
}

export function ToggleButtonDisabledExample() {
  return (
    <div className="audio-demo" data-variant="toggle-button">
      <span className="demo-label">Disabled</span>
      <div className="demo-toggle-panel">
        <ToggleButton.Root className="demo-toggle-button" defaultPressed disabled>
          Bypass
        </ToggleButton.Root>
      </div>
      <output className="demo-readout" data-muted="true">
        Locked
      </output>
    </div>
  );
}
