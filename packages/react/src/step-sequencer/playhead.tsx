import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useStepSequencerContext } from "./context.tsx";
import type { StepSequencerPlayheadProps } from "./types.ts";

export const Playhead = forwardRef<HTMLSpanElement, StepSequencerPlayheadProps>(
  function Playhead(props, ref) {
    const { render, style, ...elementProps } = props;
    const context = useStepSequencerContext("StepSequencer.Playhead");
    const { state, disabled, readOnly } = context;
    const renderState = getRenderState(state, { disabled, readOnly, dragging: false });
    const playheadProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "playhead",
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-playhead": state.playhead === undefined ? undefined : state.playhead,
      style: {
        ...style,
        "--step-sequencer-track-count": state.trackCount,
        "--step-sequencer-step-count": state.stepCount,
        "--step-sequencer-playhead-percent": state.playheadPercent,
      } as CSSProperties,
    });

    return renderElement("span", render, playheadProps, renderState);
  },
);
