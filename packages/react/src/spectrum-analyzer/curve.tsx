import { getSpectrumAnalyzerPath } from "@ryhrm-gz/audio-ui-core";
import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerCurveProps } from "./types.ts";

export const Curve = forwardRef<SVGSVGElement, SpectrumAnalyzerCurveProps>(
  function Curve(props, ref) {
    const { render, children, ...elementProps } = props;
    const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.Curve");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const curveProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "curve",
      "data-frequency-scale": context.state.frequencyScale,
      "data-empty": context.state.empty ? "" : undefined,
      "data-disabled": context.disabled ? "" : undefined,
      viewBox: "0 0 1 1",
      preserveAspectRatio: "none",
    });
    const content = children ?? (
      <path
        data-part="curve-path"
        d={getSpectrumAnalyzerPath(context.state.curve)}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    );

    return renderElement("svg", render, curveProps, renderState, content);
  },
);
