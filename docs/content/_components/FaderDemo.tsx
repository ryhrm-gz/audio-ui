import { useState } from "react";
import { Fader } from "@ryhrm-gz/audio-ui-react";

export function FaderDemo() {
  const [value, setValue] = useState(-6);

  return (
    <div className="audio-demo" data-variant="fader">
      <span className="demo-label">Level</span>
      <Fader.Root className="demo-fader" defaultValue={-6} onValueChange={setValue} value={value}>
        <div className="demo-fader-strip">
          <Fader.Scale className="demo-fader-scale" />
          <Fader.Track className="demo-fader-track">
            <Fader.Range className="demo-fader-range" />
            <Fader.Thumb aria-label="Channel gain" className="demo-fader-thumb" />
          </Fader.Track>
        </div>
        <Fader.Value
          className="demo-readout"
          format={(nextValue) => `${nextValue.toFixed(1)} dB`}
        />
      </Fader.Root>
    </div>
  );
}
