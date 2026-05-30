import { useState } from "react";
import { Knob } from "@ryhrm-gz/audio-ui-react";

export function KnobDemo() {
  const [value, setValue] = useState(-6);

  return (
    <div className="audio-demo" data-variant="knob">
      <span className="demo-label">Gain</span>
      <Knob.Root
        className="demo-knob"
        defaultValue={-6}
        max={12}
        min={-60}
        onValueChange={setValue}
        step={0.5}
        value={value}
      >
        <Knob.Control aria-label="Gain" className="demo-knob-control">
          <Knob.Thumb className="demo-knob-thumb" />
        </Knob.Control>
        <Knob.Value className="demo-readout" format={(nextValue) => `${nextValue} dB`} />
      </Knob.Root>
    </div>
  );
}
