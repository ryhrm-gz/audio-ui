import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveGridProps } from "./types.ts";

export const Grid = forwardRef<HTMLDivElement, EQCurveGridProps>(function Grid(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useEQCurveContext("EQCurve.Grid");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.draggingBand !== null,
  });
  const gridProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "grid",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.draggingBand !== null ? "" : undefined,
    style: {
      ...style,
      "--eq-curve-grid-frequency-lines": 10,
      "--eq-curve-grid-gain-lines": 9,
    } as CSSProperties,
  });

  return renderElement("div", render, gridProps, renderState);
});
