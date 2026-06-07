import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function SliderVerticalExample() {
  const [value, setValue] = useState([50]);

  return (
    <div className={styles.root} data-variant="slider">
      <span className={styles.label}>Vertical</span>
      <Slider.Root
        className={styles.slider}
        defaultValue={[50]}
        max={100}
        min={0}
        onValueChange={setValue}
        orientation="vertical"
        step={1}
        value={value}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
          <Slider.Thumb index={0} aria-label="Send level" className={styles.sliderThumb} />
        </Slider.Track>
        <Slider.Value
          index={0}
          className={styles.readout}
          format={(nextValue) =>
            Array.isArray(nextValue) ? nextValue.join(" - ") : `${nextValue}%`
          }
        />
      </Slider.Root>
    </div>
  );
}
