import { getNextXYPadKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useXYPadContext } from "./context.tsx";
import type { XYPadThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, XYPadThumbProps>(function Thumb(props, ref) {
  const { render, onKeyDown, style, "aria-describedby": ariaDescribedBy, ...elementProps } = props;
  const context = useXYPadContext("XYPad.Thumb");
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const nextValue = getNextXYPadKeyboardValue(context.state.value, event.key, context.state);

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setValue(nextValue);
    context.commitValue(nextValue);
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const describedBy =
    ariaDescribedBy === undefined ? context.valueId : `${context.valueId} ${ariaDescribedBy}`;
  const thumbProps = mergeProps(elementProps, {
    ref,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-readonly": readOnly || undefined,
    "aria-roledescription": "two-dimensional slider",
    "aria-valuemin": context.state.minX,
    "aria-valuemax": context.state.maxX,
    "aria-valuenow": context.state.value.x,
    "aria-valuetext": `x ${context.state.value.x}, y ${context.state.value.y}`,
    "aria-describedby": describedBy,
    "data-part": "thumb",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--xypad-x": context.state.value.x,
      "--xypad-y": context.state.value.y,
      "--xypad-x-percent": context.state.xPercent,
      "--xypad-y-percent": context.state.yPercent,
    } as CSSProperties,
    onKeyDown: handleKeyDown,
  });

  return renderElement("span", render, thumbProps, renderState);
});
