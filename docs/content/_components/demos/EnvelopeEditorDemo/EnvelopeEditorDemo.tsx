import { useState } from "react";
import { EnvelopeEditor } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

export function EnvelopeEditorDemo() {
  const [value, setValue] = useState({
    attack: 0.08,
    decay: 0.28,
    sustain: 0.62,
    release: 0.48,
  });

  return (
    <div className={styles.root} data-variant="envelope-editor">
      <span className={styles.label}>Amp envelope</span>
      <EnvelopeEditor.Root
        className={styles.envelope}
        maxTime={1.2}
        name="amp-envelope"
        onValueChange={setValue}
        stepLevel={0.01}
        stepTime={0.01}
        value={value}
      >
        <EnvelopeEditor.Graph className={styles.envelopeGraph}>
          <div className={styles.envelopeGrid} aria-hidden="true" />
          <EnvelopeEditor.Segments className={styles.envelopeSegments} />
          <EnvelopeEditor.Points className={styles.envelopePoints} />
        </EnvelopeEditor.Graph>
        <EnvelopeEditor.Value
          className={styles.readout}
          format={(nextValue) =>
            `A ${nextValue.attack.toFixed(2)} D ${nextValue.decay.toFixed(2)} S ${nextValue.sustain.toFixed(2)} R ${nextValue.release.toFixed(2)}`
          }
        />
        <EnvelopeEditor.HiddenInput />
      </EnvelopeEditor.Root>
    </div>
  );
}
