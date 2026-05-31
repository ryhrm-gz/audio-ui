import { useState } from "react";
import { StepSequencer } from "@ryhrm-gz/audio-ui-react";

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
    <div className="audio-demo" data-variant="step-sequencer">
      <StepSequencer.Root
        aria-label="Drum pattern"
        className="demo-step-sequencer"
        onValueChange={setValue}
        playhead={4}
        stepCount={16}
        trackCount={4}
        value={value}
      >
        <StepSequencer.Tracks className="demo-step-sequencer-tracks">
          {(track) => (
            <StepSequencer.Track className="demo-step-sequencer-track" track={track.trackIndex}>
              <span className="demo-step-sequencer-label">{trackLabels[track.trackIndex]}</span>
              <StepSequencer.Steps className="demo-step-sequencer-steps" track={track.trackIndex}>
                {(step) => (
                  <StepSequencer.Step
                    aria-label={`${trackLabels[step.trackIndex]} step ${step.stepIndex + 1}`}
                    className="demo-step-sequencer-step"
                    track={step.trackIndex}
                    step={step.stepIndex}
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
