import { useState } from "react";
import { ToggleGroup } from "@ryhrm-gz/audio-ui-react";

export function ToggleGroupAllowEmptyExample() {
  const [view, setView] = useState("");

  return (
    <div className="audio-demo" data-variant="toggle-group">
      <span className="demo-label">Allow empty</span>
      <div className="demo-toggle-stack">
        <ToggleGroup.Root
          allowEmpty
          className="demo-toggle-group"
          onValueChange={(nextValue) => setView(nextValue as string)}
          type="single"
          value={view}
        >
          <ToggleGroup.Item className="demo-toggle-group-item" value="mixer">
            Mixer
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="editor">
            Editor
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="browser">
            Browser
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className="demo-readout">{view === "" ? "None" : view}</output>
    </div>
  );
}

export function ToggleGroupVerticalExample() {
  const [routing, setRouting] = useState("main");

  return (
    <div className="audio-demo" data-variant="toggle-group">
      <span className="demo-label">Vertical</span>
      <div className="demo-toggle-stack">
        <ToggleGroup.Root
          className="demo-toggle-group"
          onValueChange={(nextValue) => setRouting(nextValue as string)}
          orientation="vertical"
          type="single"
          value={routing}
        >
          <ToggleGroup.Item className="demo-toggle-group-item" value="main">
            Main
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="aux">
            Aux
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="cue">
            Cue
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className="demo-readout">{routing}</output>
    </div>
  );
}

export function ToggleGroupDisabledExample() {
  return (
    <div className="audio-demo" data-variant="toggle-group">
      <span className="demo-label">Disabled</span>
      <div className="demo-toggle-stack">
        <ToggleGroup.Root className="demo-toggle-group" disabled type="single" value="lowpass">
          <ToggleGroup.Item className="demo-toggle-group-item" value="lowpass">
            LP
          </ToggleGroup.Item>
          <ToggleGroup.Item className="demo-toggle-group-item" value="highpass">
            HP
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <output className="demo-readout" data-muted="true">
        Locked
      </output>
    </div>
  );
}
