import { useState } from "react";
import { Fader } from "@ryhrm-gz/audio-ui-react";

export function FaderHorizontalExample() {
  const [value, setValue] = useState(-12);

  return (
    <div className="audio-demo" data-variant="fader">
      <span className="demo-label">Horizontal</span>
      <Fader.Root
        className="demo-fader"
        defaultValue={-12}
        onValueChange={setValue}
        orientation="horizontal"
        value={value}
      >
        <div className="demo-fader-strip">
          <Fader.Scale className="demo-fader-scale" />
          <Fader.Track className="demo-fader-track">
            <Fader.Range className="demo-fader-range" />
            <Fader.Thumb aria-label="Bus gain" className="demo-fader-thumb" />
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

export function FaderCustomUnityExample() {
  const [value, setValue] = useState(2);

  return (
    <div className="audio-demo" data-variant="fader">
      <span className="demo-label">Custom unity</span>
      <Fader.Root
        className="demo-fader"
        defaultValue={2}
        onValueChange={setValue}
        unity={2}
        value={value}
      >
        <div className="demo-fader-strip">
          <Fader.Scale className="demo-fader-scale" />
          <Fader.Track className="demo-fader-track">
            <Fader.Range className="demo-fader-range" />
            <Fader.Thumb aria-label="Aux send" className="demo-fader-thumb" />
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

export function FaderReadOnlyExample() {
  return (
    <div className="audio-demo" data-variant="fader">
      <span className="demo-label">Read only</span>
      <Fader.Root className="demo-fader" defaultValue={-18} readOnly>
        <div className="demo-fader-strip">
          <Fader.Scale className="demo-fader-scale" />
          <Fader.Track className="demo-fader-track">
            <Fader.Range className="demo-fader-range" />
            <Fader.Thumb aria-label="Monitor level" className="demo-fader-thumb" />
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
