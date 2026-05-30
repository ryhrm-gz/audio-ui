import { getNextFaderKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useFaderContext } from "./context.tsx";
import type { FaderThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, FaderThumbProps>(function Thumb(props, ref) {
  const { render, onKeyDown, style, ...elementProps } = props;
  const context = useFaderContext("Fader.Thumb");
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const fine = context.fineControl && event.shiftKey;
    const nextValue = getNextFaderKeyboardValue(context.state.value, event.key, context.state, {
      fine,
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
    "aria-orientation": "vertical",
    "aria-valuemin": context.state.min,
    "aria-valuemax": context.state.max,
    "aria-valuenow": context.state.value,
    "aria-valuetext": `${context.state.value} dB`,
    "aria-describedby": context.valueId,
    "data-part": "thumb",
    "data-orientation": "vertical",
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-unity": context.state.value === context.state.unity ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--fader-value": context.state.value,
      "--fader-percent": context.state.percent,
      "--fader-unity-percent": context.state.unityPercent,
      "--fader-gain": context.state.gain,
    } as CSSProperties,
    onKeyDown: handleKeyDown,
  });

  return renderElement("span", render, thumbProps, renderState);
});
