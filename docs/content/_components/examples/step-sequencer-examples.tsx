import { useState } from "react";
import { StepSequencer } from "@ryhrm-gz/audio-ui-react";

const bassPattern = [
  [true, false, false, false, true, false, false, false],
  [false, true, false, true, false, true, false, true],
];

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
const bassLabels = ["Sub", "Pulse"];

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
    <div className="audio-demo" data-variant="step-sequencer">
      <span className="demo-label">{label}</span>
      <StepSequencer.Root
        aria-label={ariaLabel}
        className="demo-step-sequencer"
        disabled={disabled}
        onValueChange={setValue}
        playhead={playhead}
        readOnly={readOnly}
        stepCount={stepCount}
        trackCount={trackCount}
        value={value}
      >
        <StepSequencer.Tracks className="demo-step-sequencer-tracks">
          {(track) => (
            <StepSequencer.Track className="demo-step-sequencer-track" track={track.trackIndex}>
              <span className="demo-step-sequencer-label">{labels[track.trackIndex]}</span>
              <StepSequencer.Steps className="demo-step-sequencer-steps" track={track.trackIndex}>
                {(step) => (
                  <StepSequencer.Step
                    aria-label={`${labels[step.trackIndex]} step ${step.stepIndex + 1}`}
                    className="demo-step-sequencer-step"
                    step={step.stepIndex}
                    track={step.trackIndex}
                  />
                )}
              </StepSequencer.Steps>
            </StepSequencer.Track>
          )}
        </StepSequencer.Tracks>
        <StepSequencer.Playhead className="demo-step-sequencer-playhead" />
      </StepSequencer.Root>
    </div>
  );
}

export function StepSequencerBassExample() {
  return (
    <StepSequencerExample
      ariaLabel="Bass pattern"
      defaultValue={bassPattern}
      label="8 step bass"
      labels={bassLabels}
      playhead={2}
      stepCount={8}
      trackCount={2}
    />
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

export function StepSequencerDisabledExample() {
  return (
    <StepSequencerExample
      ariaLabel="Disabled bass pattern"
      defaultValue={bassPattern}
      disabled
      label="Disabled"
      labels={bassLabels}
      stepCount={8}
      trackCount={2}
    />
  );
}
