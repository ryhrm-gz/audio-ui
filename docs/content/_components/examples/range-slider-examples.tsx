import { useState } from "react";
import { RangeSlider } from "@ryhrm-gz/audio-ui-react";

function formatFrequency(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${value} Hz`;
}

export function RangeSliderVerticalExample() {
  const [value, setValue] = useState<[number, number]>([200, 4000]);

  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Vertical</span>
      <RangeSlider.Root
        className="demo-range-slider"
        defaultValue={[200, 4000]}
        max={12000}
        min={20}
        onValueChange={setValue}
        orientation="vertical"
        step={10}
        value={value}
      >
        <RangeSlider.Track className="demo-range-slider-track">
          <RangeSlider.Range className="demo-range-slider-range" />
          <RangeSlider.Thumb index={0} aria-label="Low band" className="demo-range-slider-thumb" />
          <RangeSlider.Thumb index={1} aria-label="High band" className="demo-range-slider-thumb" />
        </RangeSlider.Track>
        <RangeSlider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </RangeSlider.Root>
    </div>
  );
}

export function RangeSliderInvertedExample() {
  const [value, setValue] = useState<[number, number]>([500, 6000]);

  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Inverted</span>
      <RangeSlider.Root
        className="demo-range-slider"
        defaultValue={[500, 6000]}
        inverted
        max={12000}
        min={20}
        onValueChange={setValue}
        step={10}
        value={value}
      >
        <RangeSlider.Track className="demo-range-slider-track">
          <RangeSlider.Range className="demo-range-slider-range" />
          <RangeSlider.Thumb
            index={0}
            aria-label="Band start"
            className="demo-range-slider-thumb"
          />
          <RangeSlider.Thumb index={1} aria-label="Band end" className="demo-range-slider-thumb" />
        </RangeSlider.Track>
        <RangeSlider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </RangeSlider.Root>
    </div>
  );
}

export function RangeSliderReadOnlyExample() {
  return (
    <div className="audio-demo" data-variant="range-slider">
      <span className="demo-label">Read only</span>
      <RangeSlider.Root
        className="demo-range-slider"
        defaultValue={[80, 12000]}
        max={12000}
        min={20}
        readOnly
        step={10}
      >
        <RangeSlider.Track className="demo-range-slider-track">
          <RangeSlider.Range className="demo-range-slider-range" />
          <RangeSlider.Thumb index={0} aria-label="HP cutoff" className="demo-range-slider-thumb" />
          <RangeSlider.Thumb index={1} aria-label="LP cutoff" className="demo-range-slider-thumb" />
        </RangeSlider.Track>
        <RangeSlider.Value
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue)
              ? `${formatFrequency(nextValue[0])} - ${formatFrequency(nextValue[1])}`
              : formatFrequency(nextValue)
          }
        />
      </RangeSlider.Root>
    </div>
  );
}
