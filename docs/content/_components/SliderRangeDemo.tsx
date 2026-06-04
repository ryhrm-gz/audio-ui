import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";

export function SliderRangeDemo() {
  const [value, setValue] = useState([120, 8000]);

  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Filter band</span>
      <Slider.Root
        className="demo-range-slider"
        defaultValue={[120, 8000]}
        max={12000}
        min={20}
        minStepsBetweenThumbs={12}
        name="filter-band"
        onValueChange={setValue}
        step={10}
        value={value}
      >
        <Slider.Track className="demo-range-slider-track">
          <Slider.Range className="demo-range-slider-range" />
          <Slider.Thumb
            index={0}
            aria-label="Minimum frequency"
            className="demo-range-slider-thumb"
          />
          <Slider.Thumb
            index={1}
            aria-label="Maximum frequency"
            className="demo-range-slider-thumb"
          />
        </Slider.Track>
        <Slider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
        <Slider.HiddenInput />
      </Slider.Root>
    </div>
  );
}

function formatFrequency(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${value} Hz`;
}
