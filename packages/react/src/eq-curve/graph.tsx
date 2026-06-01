import { forwardRef, type CSSProperties } from "react";
import { useComposedRefs } from "../shared/refs.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveGraphProps } from "./types.ts";

export const Graph = forwardRef<HTMLDivElement, EQCurveGraphProps>(function Graph(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useEQCurveContext("EQCurve.Graph");
  const composedRef = useComposedRefs(ref, context.graphRef);
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.draggingBand !== null,
  });
  const graphProps = mergeProps(elementProps, {
    ref: composedRef,
    "data-part": "graph",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.draggingBand !== null ? "" : undefined,
    style: {
      ...style,
      "--eq-curve-min-frequency": context.state.minFrequency,
      "--eq-curve-max-frequency": context.state.maxFrequency,
      "--eq-curve-min-gain": context.state.minGain,
      "--eq-curve-max-gain": context.state.maxGain,
    } as CSSProperties,
  });

  return renderElement("div", render, graphProps, renderState);
});
