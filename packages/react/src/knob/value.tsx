import { forwardRef } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, KnobValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useKnobContext("Knob.Value");
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
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
