import { useState } from "react";
import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function SliderInvertedExample() {
  const [value, setValue] = useState([35]);

  return (
    <div className={styles.root} data-variant="slider">
      <span className={styles.label}>Inverted</span>
      <Slider.Root
        className={styles.slider}
        defaultValue={[35]}
        inverted
        max={100}
        min={0}
        onValueChange={setValue}
        origin="right"
        step={1}
        value={value}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
          <Slider.Thumb index={0} aria-label="Feedback" className={styles.sliderThumb} />
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
