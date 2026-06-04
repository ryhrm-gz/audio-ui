import { useState } from "react";
import { EnvelopeEditor } from "@ryhrm-gz/audio-ui-react";

function EnvelopeExample({
  defaultValue,
  label,
}: {
  defaultValue: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  label: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="audio-demo" data-variant="envelope-editor">
      <span className="demo-label">{label}</span>
      <EnvelopeEditor.Root
        className="demo-envelope"
        defaultValue={defaultValue}
        maxTime={1.2}
        onValueChange={setValue}
        stepLevel={0.01}
        stepTime={0.01}
        value={value}
      >
        <EnvelopeEditor.Graph className="demo-envelope-graph">
          <div className="demo-envelope-grid" aria-hidden="true" />
          <EnvelopeEditor.Segments className="demo-envelope-segments" />
          <EnvelopeEditor.Points className="demo-envelope-points" />
        </EnvelopeEditor.Graph>
        <EnvelopeEditor.Value
          className="demo-readout demo-envelope-readout"
          format={(nextValue) =>
            `A ${nextValue.attack.toFixed(2)} D ${nextValue.decay.toFixed(2)} S ${nextValue.sustain.toFixed(2)} R ${nextValue.release.toFixed(2)}`
          }
        />
      </EnvelopeEditor.Root>
    </div>
  );
}

export function EnvelopeFastPluckExample() {
  return (
    <EnvelopeExample
      label="Fast pluck"
      defaultValue={{ attack: 0.01, decay: 0.18, sustain: 0.18, release: 0.16 }}
    />
  );
}

export function EnvelopeLongPadExample() {
  return (
    <EnvelopeExample
      label="Long pad"
      defaultValue={{ attack: 0.7, decay: 0.55, sustain: 0.82, release: 0.9 }}
    />
  );
}
