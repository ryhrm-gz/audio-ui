import { useState } from "react";
import { Knob } from "@ryhrm-gz/audio-ui-react";

function formatGainDb(value: number) {
  return value.toFixed(1);
}

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
        step={0.1}
        value={value}
      >
        <Knob.Control aria-label="Gain" className="demo-knob-control">
          <Knob.Marks className="demo-knob-marks">
            <Knob.Ticks className="demo-knob-ticks" count={13} />
            <Knob.Mark className="demo-knob-mark" value={-60}>
              <span className="demo-knob-mark-label">-inf</span>
            </Knob.Mark>
            <Knob.Mark className="demo-knob-mark" value={0}>
              <span className="demo-knob-mark-label">0</span>
            </Knob.Mark>
            <Knob.Mark className="demo-knob-mark" value={12}>
              <span className="demo-knob-mark-label">+12</span>
            </Knob.Mark>
          </Knob.Marks>
          <Knob.Thumb className="demo-knob-thumb" />
        </Knob.Control>
        <Knob.Value
          className="demo-readout demo-knob-readout"
          format={(nextValue) => (
            <>
              <span className="demo-knob-readout-value">{formatGainDb(nextValue)}</span>
              <span className="demo-knob-readout-unit">dB</span>
            </>
          )}
        />
      </Knob.Root>
    </div>
  );
}
