import { getCompressorCurvePath } from "@ryhrm-gz/audio-ui-core";
import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useCompressorCurveContext } from "./context.tsx";
import type { CompressorCurveCurveProps } from "./types.ts";

export const Curve = forwardRef<SVGSVGElement, CompressorCurveCurveProps>(
  function Curve(props, ref) {
    const { render, children, ...elementProps } = props;
    const context = useCompressorCurveContext("CompressorCurve.Curve");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const curveProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "curve",
      "data-disabled": context.disabled ? "" : undefined,
      viewBox: "0 0 1 1",
      preserveAspectRatio: "none",
    });
    const content = children ?? (
      <path
        data-part="curve-path"
        d={getCompressorCurvePath(context.state.curve)}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    );

    return renderElement("svg", render, curveProps, renderState, content);
  },
);
