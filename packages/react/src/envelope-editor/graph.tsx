import { forwardRef, type CSSProperties } from "react";
import { useComposedRefs } from "../shared/refs.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorGraphProps } from "./types.ts";

export const Graph = forwardRef<HTMLDivElement, EnvelopeEditorGraphProps>(
  function Graph(props, ref) {
    const { render, style, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.Graph");
    const composedRef = useComposedRefs(ref, context.graphRef);
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.draggingPoint !== null,
    });
    const graphProps = mergeProps(elementProps, {
      ref: composedRef,
      "data-part": "graph",
      "data-disabled": context.disabled ? "" : undefined,
      "data-readonly": context.readOnly ? "" : undefined,
      "data-dragging": context.draggingPoint !== null ? "" : undefined,
      style: {
        ...style,
        "--envelope-attack": context.state.value.attack,
        "--envelope-decay": context.state.value.decay,
        "--envelope-sustain": context.state.value.sustain,
        "--envelope-release": context.state.value.release,
        "--envelope-total-duration": context.state.totalDuration,
      } as CSSProperties,
    });

    return renderElement("div", render, graphProps, renderState);
  },
);
