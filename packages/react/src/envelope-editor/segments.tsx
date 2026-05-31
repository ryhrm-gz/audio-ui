import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { Segment } from "./segment.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorSegmentsProps } from "./types.ts";

export const Segments = forwardRef<HTMLDivElement, EnvelopeEditorSegmentsProps>(
  function Segments(props, ref) {
    const { render, children, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.Segments");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.draggingPoint !== null,
    });
    const content =
      typeof children === "function"
        ? context.state.segments.map((segment) => children(segment, context.state))
        : (children ??
          context.state.segments.map((segment) => (
            <Segment key={segment.phase} phase={segment.phase} />
          )));
    const segmentsProps = mergeProps(elementProps, {
      ref,
      "data-part": "segments",
      "data-disabled": context.disabled ? "" : undefined,
      "data-readonly": context.readOnly ? "" : undefined,
      "data-dragging": context.draggingPoint !== null ? "" : undefined,
    });

    return renderElement("div", render, segmentsProps, renderState, content);
  },
);
