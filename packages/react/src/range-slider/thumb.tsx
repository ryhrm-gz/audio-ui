import { getNextRangeSliderKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { isFineControlEnabled } from "../shared/fine-control.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useRangeSliderContext } from "./context.tsx";
import { getRangeSliderStyle } from "./root.tsx";
import type { RangeSliderThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, RangeSliderThumbProps>(function Thumb(props, ref) {
  const { index, render, onKeyDown, style, ...elementProps } = props;
  const context = useRangeSliderContext("RangeSlider.Thumb");
  const disabled = context.disabled;
  const readOnly = context.readOnly;
  const thumb = context.state.thumbs[index];
  const active = context.activeThumb === index;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
    const nextValue = getNextRangeSliderKeyboardValue(
      context.state.value,
      index,
      event.key,
      context.state,
      {
        fine,
        fineStep: fine ? context.getFineValueStep(context.state.step) : undefined,
      },
    );

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setActiveThumb(index);
    context.setValue(nextValue, { activeThumb: index, fine });
    context.commitValue(nextValue, { activeThumb: index, fine });
    context.setActiveThumb(null);
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
    "aria-valuemin": thumb.min,
    "aria-valuemax": thumb.max,
    "aria-valuenow": thumb.value,
    "aria-valuetext": String(thumb.value),
    "aria-describedby": elementProps["aria-describedby"] ?? context.valueId,
    "data-part": "thumb",
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    "data-thumb-index": index,
    "data-active": active ? "" : undefined,
    style: {
      ...getRangeSliderStyle(style, context.state),
      "--range-slider-thumb-percent": thumb.percent,
      "--range-slider-thumb-index": index,
    } as CSSProperties,
    onKeyDown: handleKeyDown,
  });

  return renderElement("span", render, thumbProps, renderState);
});
