import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, EQCurveValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useEQCurveContext("EQCurve.Value");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.draggingBand !== null,
  });
  const content =
    typeof children === "function"
      ? children(renderState)
      : (children ??
        format?.(context.state.value, context.state) ??
        `${context.state.bands.length} bands`);
  const valueProps = mergeProps(elementProps, {
    ref,
    id: context.valueId,
    "data-part": "value",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.draggingBand !== null ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
