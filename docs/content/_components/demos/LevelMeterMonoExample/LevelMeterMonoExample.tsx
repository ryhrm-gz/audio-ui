import { LevelMeter } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

function LevelMeterDisplay({
  ariaLabel,
  channels,
  label,
  orientation = "vertical",
  peak,
  value,
}: {
  ariaLabel: string;
  channels: number;
  label: string;
  orientation?: "horizontal" | "vertical";
  peak: readonly number[];
  value: readonly number[];
}) {
  return (
    <div className={styles.root} data-variant="level-meter">
      <span className={styles.label}>{label}</span>
      <LevelMeter.Root
        aria-label={ariaLabel}
        channels={channels}
        className={styles.levelMeter}
        orientation={orientation}
        peak={peak}
        value={value}
      >
        <LevelMeter.Scale className={styles.levelMeterScale} />
        <LevelMeter.Track className={styles.levelMeterTrack}>
          <LevelMeter.Segments className={styles.levelMeterSegments} />
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Bar channel={channel} className={styles.levelMeterBar} key={channel}>
              <LevelMeter.Segments channel={channel} className={styles.levelMeterBarSegments} />
            </LevelMeter.Bar>
          ))}
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Peak channel={channel} className={styles.levelMeterPeak} key={channel} />
          ))}
        </LevelMeter.Track>
        <div className={styles.meterReadouts}>
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Value
              channel={channel}
              className={styles.readout}
              format={(nextValue) => `${nextValue.toFixed(1)} dB`}
              key={channel}
            />
          ))}
        </div>
      </LevelMeter.Root>
    </div>
  );
}

export function LevelMeterMonoExample() {
  return (
    <LevelMeterDisplay
      ariaLabel="Mono input level"
      channels={1}
      label="Mono"
      peak={[-8]}
      value={[-12.5]}
    />
  );
}
