import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import type { SliderRangeProps } from "./types.ts";

export const Range = forwardRef<HTMLSpanElement, SliderRangeProps>(function Range(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useSliderContext("Slider.Range");
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
    "data-origin": context.state.origin,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--slider-value": context.state.value,
      "--slider-percent": context.state.percent,
      "--slider-origin-percent": context.state.originPercent,
      "--slider-range-start-percent": context.state.rangeStartPercent,
      "--slider-range-end-percent": context.state.rangeEndPercent,
      "--slider-range-size-percent": context.state.rangeSizePercent,
    } as CSSProperties,
  });

  return renderElement("span", render, rangeProps, renderState);
});
