import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useRangeSliderContext } from "./context.tsx";
import { getRangeSliderStyle } from "./root.tsx";
import type { RangeSliderRangeProps } from "./types.ts";

export const Range = forwardRef<HTMLSpanElement, RangeSliderRangeProps>(function Range(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useRangeSliderContext("RangeSlider.Range");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const rangeProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "range",
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: getRangeSliderStyle(style, context.state),
  });

  return renderElement("span", render, rangeProps, renderState);
});
