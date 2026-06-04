import { getNextSliderKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { isFineControlEnabled } from "../shared/fine-control.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import type { SliderThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, SliderThumbProps>(function Thumb(props, ref) {
  const { render, onKeyDown, style, ...elementProps } = props;
  const context = useSliderContext("Slider.Thumb");
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
    const nextValue = getNextSliderKeyboardValue(context.state.value, event.key, context.state, {
      fine,
      fineStep: fine ? context.getFineValueStep(context.state.step) : undefined,
    });

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setValue(nextValue, { fine });
    context.commitValue(nextValue, { fine });
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const thumbProps = mergeProps(elementProps, {
    ref,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-readonly": readOnly || undefined,
    "aria-orientation": context.state.orientation,
    "aria-valuemin": context.state.min,
    "aria-valuemax": context.state.max,
    "aria-valuenow": context.state.value,
    "aria-valuetext": String(context.state.value),
    "aria-describedby": context.valueId,
    "data-part": "thumb",
    "data-orientation": context.state.orientation,
    "data-origin": context.state.origin,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
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
    onKeyDown: handleKeyDown,
  });

  return renderElement("span", render, thumbProps, renderState);
});
