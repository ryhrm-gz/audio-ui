import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function SliderDemo() {
  const [value, setValue] = useState([0]);

  return (
    <div className={styles.root} data-variant="slider">
      <span className={styles.label}>Pan</span>
      <Slider.Root
        className={styles.slider}
        defaultValue={[0]}
        max={100}
        min={-100}
        onValueChange={setValue}
        origin="center"
        step={1}
        value={value}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
          <Slider.Thumb index={0} aria-label="Pan" className={styles.sliderThumb} />
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
