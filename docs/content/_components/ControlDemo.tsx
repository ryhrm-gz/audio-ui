import { useState, type CSSProperties } from "react";
import { Fader, Knob, Slider } from "@audio-ui/react";

interface ControlDemoProps {
  variant: "knob" | "slider" | "fader";
}

export function ControlDemo({ variant }: ControlDemoProps) {
  const [value, setValue] = useState(variant === "fader" ? -6 : 0);

  return (
    <div className="audio-demo" data-variant={variant}>
      {variant === "knob" ? (
        <Knob.Root
          className="demo-knob"
          max={12}
          min={-60}
          onValueChange={setValue}
          step={0.5}
          style={{ "--demo-accent": "#f5b84b" } as CSSProperties}
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
          max={100}
          min={-100}
          onValueChange={setValue}
          step={1}
          style={{ "--demo-accent": "#42c3a7" } as CSSProperties}
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
          onValueChange={setValue}
          style={{ "--demo-accent": "#6aa9ff" } as CSSProperties}
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
