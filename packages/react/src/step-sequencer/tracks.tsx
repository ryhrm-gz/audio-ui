import { Fragment, forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useStepSequencerContext } from "./context.tsx";
import { Track } from "./track.tsx";
import type { StepSequencerTracksProps } from "./types.ts";

export const Tracks = forwardRef<HTMLDivElement, StepSequencerTracksProps>(
  function Tracks(props, ref) {
    const { children, render, style, ...elementProps } = props;
    const context = useStepSequencerContext("StepSequencer.Tracks");
    const { state, disabled, readOnly } = context;
    const renderState = getRenderState(state, { disabled, readOnly, dragging: false });
    const content =
      typeof children === "function"
        ? state.tracks.map((track) => (
            <Fragment key={track.trackIndex}>
              {children(
                getRenderState(track, { disabled, readOnly, dragging: false }),
                renderState,
              )}
            </Fragment>
          ))
        : (children ??
          state.tracks.map((track) => <Track key={track.trackIndex} track={track.trackIndex} />));
    const tracksProps = mergeProps(elementProps, {
      ref,
      role: "group",
      "data-part": "tracks",
      style: {
        ...style,
        "--step-sequencer-track-count": state.trackCount,
        "--step-sequencer-step-count": state.stepCount,
      } as CSSProperties,
    });

    return renderElement("div", render, tracksProps, renderState, content);
  },
);
