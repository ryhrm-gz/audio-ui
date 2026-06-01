import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useCompressorCurveContext } from "./context.tsx";
import type { CompressorCurveGridProps } from "./types.ts";

export const Grid = forwardRef<HTMLDivElement, CompressorCurveGridProps>(function Grid(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useCompressorCurveContext("CompressorCurve.Grid");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const gridProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "grid",
    "data-disabled": context.disabled ? "" : undefined,
    style: {
      ...style,
      "--compressor-curve-grid-input-lines": 7,
      "--compressor-curve-grid-output-lines": 7,
    } as CSSProperties,
  });

  return renderElement("div", render, gridProps, renderState);
});
