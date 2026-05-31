import { useState } from "react";
import { EnvelopeEditor } from "@ryhrm-gz/audio-ui-react";

export function EnvelopeEditorDemo() {
  const [value, setValue] = useState({
    attack: 0.08,
    decay: 0.28,
    sustain: 0.62,
    release: 0.48,
  });

  return (
    <div className="audio-demo" data-variant="envelope-editor">
      <span className="demo-label">Amp envelope</span>
      <EnvelopeEditor.Root
        className="demo-envelope"
        maxTime={1.2}
        name="amp-envelope"
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
        <EnvelopeEditor.HiddenInput />
      </EnvelopeEditor.Root>
    </div>
  );
}
