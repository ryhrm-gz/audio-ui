import { Slider } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

function formatFrequency(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${value} Hz`;
}

export function SliderRangeReadOnlyExample() {
  return (
    <div className={styles.root} data-variant="range-slider">
      <span className={styles.label}>Read only</span>
      <Slider.Root
        className={styles.rangeSlider}
        defaultValue={[80, 12000]}
        max={12000}
        min={20}
        readOnly
        step={10}
      >
        <Slider.Track className={styles.rangeSliderTrack}>
          <Slider.Range className={styles.rangeSliderRange} />
          <Slider.Thumb index={0} aria-label="HP cutoff" className={styles.rangeSliderThumb} />
          <Slider.Thumb index={1} aria-label="LP cutoff" className={styles.rangeSliderThumb} />
        </Slider.Track>
        <Slider.Value
          className={styles.readout}
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
