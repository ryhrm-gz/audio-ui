import { Knob } from "@ryhrm-gz/audio-ui-react";

export function KnobReadOnlyExample() {
  return (
    <div className="audio-demo" data-variant="knob">
      <span className="demo-label">Read only</span>
      <Knob.Root className="demo-knob" defaultValue={0.7} max={1} min={0} readOnly step={0.01}>
        <Knob.Control aria-label="Send" className="demo-knob-control">
          <Knob.Thumb className="demo-knob-thumb" />
        </Knob.Control>
        <Knob.Value
          className="demo-readout"
          format={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />
      </Knob.Root>
    </div>
  );
}
