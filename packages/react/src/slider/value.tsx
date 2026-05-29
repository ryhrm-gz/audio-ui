import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import type { SliderValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, SliderValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useSliderContext("Slider.Value");
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
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
