import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useXYPadContext } from "./context.tsx";
import type { XYPadValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, XYPadValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useXYPadContext("XYPad.Value");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content =
    typeof children === "function"
      ? children(renderState)
      : (children ??
        format?.(context.state.value, context.state) ??
        `${context.state.value.x}, ${context.state.value.y}`);
  const valueProps = mergeProps(elementProps, {
    ref,
    id: context.valueId,
    "data-part": "value",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
