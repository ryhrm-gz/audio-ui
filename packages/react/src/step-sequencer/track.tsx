import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useStepSequencerContext } from "./context.tsx";
import { Steps } from "./steps.tsx";
import type { StepSequencerTrackProps } from "./types.ts";

export const Track = forwardRef<HTMLDivElement, StepSequencerTrackProps>(
  function Track(props, ref) {
    const { track: trackIndex, children, render, style, ...elementProps } = props;
    const context = useStepSequencerContext("StepSequencer.Track");
    const { state, disabled, readOnly } = context;
    const track = state.tracks[trackIndex];

    if (track === undefined) {
      throw new Error(`StepSequencer.Track could not find track ${trackIndex}.`);
    }

    const renderState = getRenderState(track, { disabled, readOnly, dragging: false });
    const content =
      typeof children === "function"
        ? children(renderState)
        : (children ?? <Steps track={trackIndex} />);
    const trackProps = mergeProps(elementProps, {
      ref,
      role: "group",
      "data-part": "track",
      "data-active": track.activeStepCount > 0 ? "" : undefined,
      "data-disabled": disabled || track.disabledStepCount === track.steps.length ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-track-index": track.trackIndex,
      style: {
        ...style,
        "--step-sequencer-track-count": state.trackCount,
        "--step-sequencer-step-count": state.stepCount,
        "--step-sequencer-track-index": track.trackIndex,
      } as CSSProperties,
    });

    return renderElement("div", render, trackProps, renderState, content);
  },
);
