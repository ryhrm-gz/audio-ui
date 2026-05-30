import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, LevelMeterValueProps>(function Value(props, ref) {
  const { channel, render, children, format, ...elementProps } = props;
  const context = useLevelMeterContext("LevelMeter.Value");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const value =
    channel === undefined
      ? context.state.maxValue
      : (context.state.channels[channel]?.value ?? context.state.min);
  const content =
    typeof children === "function"
      ? children(renderState)
      : (children ?? format?.(value, context.state) ?? value);
  const valueProps = mergeProps(elementProps, {
    ref,
    "data-part": "value",
    "data-channel": channel,
    "data-clipped": value >= context.state.clip ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});
