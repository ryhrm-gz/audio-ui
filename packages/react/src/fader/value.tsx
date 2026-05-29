import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useFaderContext } from "./context.tsx";
import type { FaderValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, FaderValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useFaderContext("Fader.Value");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content =
    typeof children === "function"
      ? children(renderState)
      : (children ?? format?.(context.state.value, context.state) ?? context.state.value);
  const valueProps = mergeProps(elementProps, {
    ref,
    id: context.valueId,
    "data-part": "value",
    "data-orientation": "vertical",
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-unity": context.state.value === context.state.unity ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
