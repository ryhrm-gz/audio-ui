import { useState } from "react";
import { Fader, Knob, Slider } from "@ryhrm-gz/audio-ui-react";

interface ControlDemoProps {
  variant: "knob" | "slider" | "fader";
}

const labels: Record<ControlDemoProps["variant"], string> = {
  knob: "Gain",
  slider: "Pan",
  fader: "Level",
};

export function ControlDemo({ variant }: ControlDemoProps) {
  const defaultValue = variant === "slider" ? 0 : -6;
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="audio-demo" data-variant={variant}>
      <span className="demo-label">{labels[variant]}</span>

      {variant === "knob" ? (
        <Knob.Root
          className="demo-knob"
          defaultValue={defaultValue}
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
      ) : null}

      {variant === "slider" ? (
        <Slider.Root
          className="demo-slider"
          defaultValue={defaultValue}
          max={100}
          min={-100}
          onValueChange={setValue}
          origin="center"
          step={1}
          value={value}
        >
          <Slider.Track className="demo-slider-track">
            <Slider.Range className="demo-slider-range" />
            <Slider.Thumb aria-label="Pan" className="demo-slider-thumb" />
          </Slider.Track>
          <Slider.Value className="demo-readout" format={(nextValue) => `${nextValue}%`} />
        </Slider.Root>
      ) : null}

      {variant === "fader" ? (
        <Fader.Root
          className="demo-fader"
          defaultValue={defaultValue}
          onValueChange={setValue}
          value={value}
        >
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
      ) : null}
    </div>
  );
}
