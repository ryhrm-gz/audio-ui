import { useState } from "react";
import { StepSequencer } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

const drumPattern = [
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

const drumLabels = ["Kick", "Snare", "Hat", "Gate"];

function StepSequencerExample({
  ariaLabel,
  defaultValue,
  disabled = false,
  label,
  labels,
  playhead,
  readOnly = false,
  stepCount,
  trackCount,
}: {
  ariaLabel: string;
  defaultValue: boolean[][];
  disabled?: boolean;
  label: string;
  labels: string[];
  playhead?: number;
  readOnly?: boolean;
  stepCount: number;
  trackCount: number;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={styles.root} data-variant="step-sequencer">
      <span className={styles.label}>{label}</span>
      <StepSequencer.Root
        aria-label={ariaLabel}
        className={styles.stepSequencer}
        disabled={disabled}
        onValueChange={setValue}
        playhead={playhead}
        readOnly={readOnly}
        stepCount={stepCount}
        trackCount={trackCount}
        value={value}
      >
        <StepSequencer.Tracks className={styles.stepSequencerTracks}>
          {(track) => (
            <StepSequencer.Track className={styles.stepSequencerTrack} track={track.trackIndex}>
              <span className={styles.stepSequencerLabel}>{labels[track.trackIndex]}</span>
              <StepSequencer.Steps className={styles.stepSequencerSteps} track={track.trackIndex}>
                {(step) => (
                  <StepSequencer.Step
                    aria-label={`${labels[step.trackIndex]} step ${step.stepIndex + 1}`}
                    className={styles.stepSequencerStep}
                    step={step.stepIndex}
                    track={step.trackIndex}
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

export function StepSequencerReadOnlyExample() {
  return (
    <StepSequencerExample
      ariaLabel="Locked drum pattern"
      defaultValue={drumPattern}
      label="Read only"
      labels={drumLabels}
      playhead={4}
      readOnly
      stepCount={16}
      trackCount={4}
    />
  );
}
