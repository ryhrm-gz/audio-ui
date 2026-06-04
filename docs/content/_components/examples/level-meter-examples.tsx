import { LevelMeter } from "@ryhrm-gz/audio-ui-react";

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
    <div className="audio-demo" data-variant="level-meter">
      <span className="demo-label">{label}</span>
      <LevelMeter.Root
        aria-label={ariaLabel}
        channels={channels}
        className="demo-level-meter"
        orientation={orientation}
        peak={peak}
        value={value}
      >
        <LevelMeter.Scale className="demo-level-meter-scale" />
        <LevelMeter.Track className="demo-level-meter-track">
          <LevelMeter.Segments className="demo-level-meter-segments" />
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Bar channel={channel} className="demo-level-meter-bar" key={channel}>
              <LevelMeter.Segments channel={channel} className="demo-level-meter-bar-segments" />
            </LevelMeter.Bar>
          ))}
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Peak channel={channel} className="demo-level-meter-peak" key={channel} />
          ))}
        </LevelMeter.Track>
        <div className="demo-meter-readouts">
          {Array.from({ length: channels }, (_, channel) => (
            <LevelMeter.Value
              channel={channel}
              className="demo-readout"
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

export function LevelMeterHorizontalExample() {
  return (
    <LevelMeterDisplay
      ariaLabel="Stereo bus level"
      channels={2}
      label="Horizontal"
      orientation="horizontal"
      peak={[-12, -8]}
      value={[-18, -10]}
    />
  );
}

export function LevelMeterFourChannelExample() {
  return (
    <LevelMeterDisplay
      ariaLabel="Surround bed level"
      channels={4}
      label="Four channel"
      peak={[-18, -12, -8, -4]}
      value={[-20, -15, -10, -5]}
    />
  );
}
