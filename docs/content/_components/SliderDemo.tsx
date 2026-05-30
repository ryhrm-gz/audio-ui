import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";

export function SliderDemo() {
  const [value, setValue] = useState(0);

  return (
    <div className="audio-demo" data-variant="slider">
      <span className="demo-label">Pan</span>
      <Slider.Root
        className="demo-slider"
        defaultValue={0}
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
    </div>
  );
}
