import { Fragment, forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useStepSequencerContext } from "./context.tsx";
import { Step } from "./step.tsx";
import type { StepSequencerStepsProps } from "./types.ts";

export const Steps = forwardRef<HTMLDivElement, StepSequencerStepsProps>(
  function Steps(props, ref) {
    const { track: trackIndex, children, render, style, ...elementProps } = props;
    const context = useStepSequencerContext("StepSequencer.Steps");
    const { state, disabled, readOnly } = context;
    const track = state.tracks[trackIndex];

    if (track === undefined) {
      throw new Error(`StepSequencer.Steps could not find track ${trackIndex}.`);
    }

    const renderState = getRenderState(track, { disabled, readOnly, dragging: false });
    const rootRenderState = getRenderState(state, { disabled, readOnly, dragging: false });
    const content =
      typeof children === "function"
        ? track.steps.map((step) => (
            <Fragment key={step.stepIndex}>
              {children(
                getRenderState(step, {
                  disabled: disabled || step.disabled,
                  readOnly,
                  dragging: false,
                }),
                renderState,
                rootRenderState,
              )}
            </Fragment>
          ))
        : (children ??
          track.steps.map((step) => (
            <Step key={step.stepIndex} track={trackIndex} step={step.stepIndex} />
          )));
    const stepsProps = mergeProps(elementProps, {
      ref,
      role: "group",
      "data-part": "steps",
      "data-track-index": track.trackIndex,
      style: {
        ...style,
        "--step-sequencer-track-count": state.trackCount,
        "--step-sequencer-step-count": state.stepCount,
        "--step-sequencer-track-index": track.trackIndex,
      } as CSSProperties,
    });

    return renderElement("div", render, stepsProps, renderState, content);
  },
);
