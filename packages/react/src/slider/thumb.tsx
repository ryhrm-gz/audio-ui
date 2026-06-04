import { getNextSliderKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import { getSliderStyle } from "./root.tsx";
import type { SliderThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, SliderThumbProps>(function Thumb(props, ref) {
  const { index, render, onKeyDown, style, ...elementProps } = props;
  const context = useSliderContext("Slider.Thumb");
  const disabled = context.disabled;
  const readOnly = context.readOnly;
  const thumbIndex = requireThumbIndex(index);
  const thumb = context.state.thumbs[thumbIndex];
  const active = context.activeThumb === thumbIndex;

  if (thumb === undefined) {
    throw new Error(`Slider.Thumb index ${thumbIndex} does not exist in Slider.Root value.`);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const nextValue = getNextSliderKeyboardValue(
      context.state.value,
      thumbIndex,
      event.key,
      context.state,
    );

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setActiveThumb(thumbIndex);
    context.setValue(nextValue, { activeThumb: thumbIndex });
    context.commitValue(nextValue, { activeThumb: thumbIndex });
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
    "data-thumb-count": context.state.thumbs.length,
    "data-orientation": context.state.orientation,
    "data-origin": context.state.origin,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    "data-thumb-index": thumbIndex,
    "data-active": active ? "" : undefined,
    style: {
      ...getSliderStyle(style, context.state),
      "--slider-thumb-percent": thumb.percent,
      "--slider-thumb-index": thumbIndex,
    } as CSSProperties,
    onKeyDown: handleKeyDown,
  });

  return renderElement("span", render, thumbProps, renderState);
});

function requireThumbIndex(index: SliderThumbProps["index"]) {
  if (index === undefined) {
    throw new Error("Slider.Thumb requires an index.");
  }

  return index;
}
