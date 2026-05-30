import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterBarProps } from "./types.ts";

export const Bar = forwardRef<HTMLSpanElement, LevelMeterBarProps>(function Bar(props, ref) {
  const { channel = 0, render, style, ...elementProps } = props;
  const context = useLevelMeterContext("LevelMeter.Bar");
  const channelState = context.state.channels[channel] ?? context.state.channels[0];
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const barProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "bar",
    "data-channel": channel,
    "data-clipped": channelState.clipped ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    style: {
      ...style,
      "--level-meter-channel-index": channel,
      "--level-meter-value": channelState.value,
      "--level-meter-percent": channelState.percent,
    } as CSSProperties,
  });

  return renderElement("span", render, barProps, renderState);
});
