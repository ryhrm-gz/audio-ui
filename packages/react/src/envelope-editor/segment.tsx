import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorSegmentProps, EnvelopeEditorSegmentState } from "./types.ts";

export const Segment = forwardRef<HTMLSpanElement, EnvelopeEditorSegmentProps>(
  function Segment(props, ref) {
    const { phase, render, style, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.Segment");
    const segment = context.state.segments.find((nextSegment) => nextSegment.phase === phase);

    if (segment === undefined) {
      return null;
    }

    const state = {
      ...context.state,
      segment,
    } satisfies EnvelopeEditorSegmentState;
    const renderState = getRenderState(state, {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.draggingPoint !== null,
    });
    const segmentProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "segment",
      "data-phase": segment.phase,
      "data-disabled": context.disabled ? "" : undefined,
      "data-readonly": context.readOnly ? "" : undefined,
      "data-dragging": context.draggingPoint !== null ? "" : undefined,
      style: {
        ...style,
        "--envelope-segment-start-x": segment.start.x,
        "--envelope-segment-start-y": segment.start.y,
        "--envelope-segment-end-x": segment.end.x,
        "--envelope-segment-end-y": segment.end.y,
      } as CSSProperties,
    });

    return renderElement("span", render, segmentProps, renderState);
  },
);
