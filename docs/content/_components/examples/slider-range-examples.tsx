import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";

function formatFrequency(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${value} Hz`;
}

export function SliderRangeVerticalExample() {
  const [value, setValue] = useState([200, 4000]);

  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Vertical</span>
      <Slider.Root
        className="demo-range-slider"
        defaultValue={[200, 4000]}
        max={12000}
        min={20}
        onValueChange={setValue}
        orientation="vertical"
        step={10}
        value={value}
      >
        <Slider.Track className="demo-range-slider-track">
          <Slider.Range className="demo-range-slider-range" />
          <Slider.Thumb index={0} aria-label="Low band" className="demo-range-slider-thumb" />
          <Slider.Thumb index={1} aria-label="High band" className="demo-range-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </Slider.Root>
    </div>
  );
}

export function SliderRangeInvertedExample() {
  const [value, setValue] = useState([500, 6000]);

  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Inverted</span>
      <Slider.Root
        className="demo-range-slider"
        defaultValue={[500, 6000]}
        inverted
        max={12000}
        min={20}
        onValueChange={setValue}
        step={10}
        value={value}
      >
        <Slider.Track className="demo-range-slider-track">
          <Slider.Range className="demo-range-slider-range" />
          <Slider.Thumb index={0} aria-label="Band start" className="demo-range-slider-thumb" />
          <Slider.Thumb index={1} aria-label="Band end" className="demo-range-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </Slider.Root>
    </div>
  );
}

export function SliderRangeReadOnlyExample() {
  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Read only</span>
      <Slider.Root
        className="demo-range-slider"
        defaultValue={[80, 12000]}
        max={12000}
        min={20}
        readOnly
        step={10}
      >
        <Slider.Track className="demo-range-slider-track">
          <Slider.Range className="demo-range-slider-range" />
          <Slider.Thumb index={0} aria-label="HP cutoff" className="demo-range-slider-thumb" />
          <Slider.Thumb index={1} aria-label="LP cutoff" className="demo-range-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </Slider.Root>
    </div>
  );
}
