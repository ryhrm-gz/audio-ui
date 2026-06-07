import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function SliderDisabledExample() {
  return (
    <div className={styles.root} data-variant="slider">
      <span className={styles.label}>Disabled</span>
      <Slider.Root
        className={styles.slider}
        defaultValue={[60]}
        disabled
        max={100}
        min={0}
        step={1}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
          <Slider.Thumb index={0} aria-label="Width" className={styles.sliderThumb} />
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
