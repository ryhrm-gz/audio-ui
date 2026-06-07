import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function SliderRangeDemo() {
  const [value, setValue] = useState([120, 8000]);

  return (
    <div className={styles.root} data-variant="range-slider">
      <span className={styles.label}>Filter band</span>
      <Slider.Root
        className={styles.rangeSlider}
        defaultValue={[120, 8000]}
        max={12000}
        min={20}
        minStepsBetweenThumbs={12}
        name="filter-band"
        onValueChange={setValue}
        step={10}
        value={value}
      >
        <Slider.Track className={styles.rangeSliderTrack}>
          <Slider.Range className={styles.rangeSliderRange} />
          <Slider.Thumb
            index={0}
            aria-label="Minimum frequency"
            className={styles.rangeSliderThumb}
          />
          <Slider.Thumb
            index={1}
            aria-label="Maximum frequency"
            className={styles.rangeSliderThumb}
          />
        </Slider.Track>
        <Slider.Value
          className={styles.readout}
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
