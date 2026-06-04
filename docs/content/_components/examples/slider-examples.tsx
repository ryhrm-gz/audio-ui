import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";

export function SliderVerticalExample() {
  const [value, setValue] = useState([50]);

  return (
    <div className="audio-demo" data-variant="slider">
      <span className="demo-label">Vertical</span>
      <Slider.Root
        className="demo-slider"
        defaultValue={[50]}
        max={100}
        min={0}
        onValueChange={setValue}
        orientation="vertical"
        step={1}
        value={value}
      >
        <Slider.Track className="demo-slider-track">
          <Slider.Range className="demo-slider-range" />
          <Slider.Thumb index={0} aria-label="Send level" className="demo-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          index={0}
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue) ? nextValue.join(" - ") : `${nextValue}%`
          }
        />
      </Slider.Root>
    </div>
  );
}

export function SliderInvertedExample() {
  const [value, setValue] = useState([35]);

  return (
    <div className="audio-demo" data-variant="slider">
      <span className="demo-label">Inverted</span>
      <Slider.Root
        className="demo-slider"
        defaultValue={[35]}
        inverted
        max={100}
        min={0}
        onValueChange={setValue}
        origin="right"
        step={1}
        value={value}
      >
        <Slider.Track className="demo-slider-track">
          <Slider.Range className="demo-slider-range" />
          <Slider.Thumb index={0} aria-label="Feedback" className="demo-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          index={0}
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue) ? nextValue.join(" - ") : `${nextValue}%`
          }
        />
      </Slider.Root>
    </div>
  );
}

export function SliderDisabledExample() {
  return (
    <div className="audio-demo" data-variant="slider">
      <span className="demo-label">Disabled</span>
      <Slider.Root className="demo-slider" defaultValue={[60]} disabled max={100} min={0} step={1}>
        <Slider.Track className="demo-slider-track">
          <Slider.Range className="demo-slider-range" />
          <Slider.Thumb index={0} aria-label="Width" className="demo-slider-thumb" />
        </Slider.Track>
        <Slider.Value
          index={0}
          className="demo-readout"
          format={(nextValue) =>
            Array.isArray(nextValue) ? nextValue.join(" - ") : `${nextValue}%`
          }
        />
      </Slider.Root>
    </div>
  );
}
