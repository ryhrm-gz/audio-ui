import { getEQCurvePath } from "@ryhrm-gz/audio-ui-core";
import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveCurveProps } from "./types.ts";

export const Curve = forwardRef<SVGSVGElement, EQCurveCurveProps>(function Curve(props, ref) {
  const { render, children, ...elementProps } = props;
  const context = useEQCurveContext("EQCurve.Curve");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.draggingBand !== null,
  });
  const curveProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "curve",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.draggingBand !== null ? "" : undefined,
    viewBox: "0 0 1 1",
    preserveAspectRatio: "none",
  });
  const content = children ?? (
    <path
      data-part="curve-path"
      d={getEQCurvePath(context.state.curve)}
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  );

  return renderElement("svg", render, curveProps, renderState, content);
});
