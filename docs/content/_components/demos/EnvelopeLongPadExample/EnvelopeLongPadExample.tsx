import { useState } from "react";
import { EnvelopeEditor } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

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
    <div className={styles.root} data-variant="envelope-editor">
      <span className={styles.label}>{label}</span>
      <EnvelopeEditor.Root
        className={styles.envelope}
        defaultValue={defaultValue}
        maxTime={1.2}
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
      </EnvelopeEditor.Root>
    </div>
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
