import { getSpectrumAnalyzerBarsPath } from "@ryhrm-gz/audio-ui-core";
import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerBarsProps } from "./types.ts";

export const Bars = forwardRef<SVGSVGElement, SpectrumAnalyzerBarsProps>(function Bars(props, ref) {
  const { render, children, ...elementProps } = props;
  const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.Bars");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const barsProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "bars",
    "data-frequency-scale": context.state.frequencyScale,
    "data-clipped": context.state.bins.some((bin) => bin.clipped) ? "" : undefined,
    "data-out-of-range": context.state.bins.some((bin) => bin.outOfRange) ? "" : undefined,
    "data-empty": context.state.empty ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    viewBox: "0 0 1 1",
    preserveAspectRatio: "none",
  });
  const content = children ?? (
    <path data-part="bars-path" d={getSpectrumAnalyzerBarsPath(context.state.bins)} />
  );

  return renderElement("svg", render, barsProps, renderState, content);
});
