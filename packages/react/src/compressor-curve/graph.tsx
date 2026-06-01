import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useCompressorCurveContext } from "./context.tsx";
import type { CompressorCurveGraphProps } from "./types.ts";

export const Graph = forwardRef<HTMLDivElement, CompressorCurveGraphProps>(
  function Graph(props, ref) {
    const { render, style, ...elementProps } = props;
    const context = useCompressorCurveContext("CompressorCurve.Graph");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const graphProps = mergeProps(elementProps, {
      ref,
      "data-part": "graph",
      "data-disabled": context.disabled ? "" : undefined,
      style: {
        ...style,
        "--compressor-curve-min-input": context.state.minInput,
        "--compressor-curve-max-input": context.state.maxInput,
        "--compressor-curve-min-output": context.state.minOutput,
        "--compressor-curve-max-output": context.state.maxOutput,
      } as CSSProperties,
    });

    return renderElement("div", render, graphProps, renderState);
  },
);
