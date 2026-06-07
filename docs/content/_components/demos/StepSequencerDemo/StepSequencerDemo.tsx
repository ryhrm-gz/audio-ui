import { useState } from "react";
import { StepSequencer } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

const initialPattern = [
  [
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
  ],
  [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ],
];

const trackLabels = ["Kick", "Snare", "Hat", "Gate"];

export function StepSequencerDemo() {
  const [value, setValue] = useState(initialPattern);

  return (
    <div className={styles.root} data-variant="step-sequencer">
      <StepSequencer.Root
        aria-label="Drum pattern"
        className={styles.stepSequencer}
        onValueChange={setValue}
        playhead={4}
        stepCount={16}
        trackCount={4}
        value={value}
      >
        <StepSequencer.Tracks className={styles.stepSequencerTracks}>
          {(track) => (
            <StepSequencer.Track className={styles.stepSequencerTrack} track={track.trackIndex}>
              <span className={styles.stepSequencerLabel}>{trackLabels[track.trackIndex]}</span>
              <StepSequencer.Steps className={styles.stepSequencerSteps} track={track.trackIndex}>
                {(step) => (
                  <StepSequencer.Step
                    aria-label={`${trackLabels[step.trackIndex]} step ${step.stepIndex + 1}`}
                    className={styles.stepSequencerStep}
                    track={step.trackIndex}
                    step={step.stepIndex}
                  />
                )}
              </StepSequencer.Steps>
            </StepSequencer.Track>
          )}
        </StepSequencer.Tracks>
        <StepSequencer.Playhead className={styles.stepSequencerPlayhead} />
      </StepSequencer.Root>
    </div>
  );
}
