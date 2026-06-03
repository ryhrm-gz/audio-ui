import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerGraphProps } from "./types.ts";

export const Graph = forwardRef<HTMLDivElement, SpectrumAnalyzerGraphProps>(
  function Graph(props, ref) {
    const { render, style, ...elementProps } = props;
    const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.Graph");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const graphProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "graph",
      "data-frequency-scale": context.state.frequencyScale,
      "data-empty": context.state.empty ? "" : undefined,
      "data-disabled": context.disabled ? "" : undefined,
      style: {
        ...style,
        "--spectrum-analyzer-bin-count": context.state.binCount,
        "--spectrum-analyzer-min-frequency": context.state.minFrequency,
        "--spectrum-analyzer-max-frequency": context.state.maxFrequency,
        "--spectrum-analyzer-min-magnitude": context.state.minMagnitude,
        "--spectrum-analyzer-max-magnitude": context.state.maxMagnitude,
      } as CSSProperties,
    });

    return renderElement("div", render, graphProps, renderState);
  },
);
