import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterPeakProps } from "./types.ts";

export const Peak = forwardRef<HTMLSpanElement, LevelMeterPeakProps>(function Peak(props, ref) {
  const { channel = 0, render, style, ...elementProps } = props;
  const context = useLevelMeterContext("LevelMeter.Peak");
  const peakState = context.state.peak[channel] ?? context.state.peak[0];
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const peakProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "peak",
    "data-channel": channel,
    "data-clipped": peakState.clipped ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    style: {
      ...style,
      "--level-meter-channel-index": channel,
      "--level-meter-peak-value": peakState.value,
      "--level-meter-peak-percent": peakState.percent,
    } as CSSProperties,
  });

  return renderElement("span", render, peakProps, renderState);
});
