import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterTrackProps } from "./types.ts";

export const Track = forwardRef<HTMLDivElement, LevelMeterTrackProps>(function Track(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useLevelMeterContext("LevelMeter.Track");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const trackProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "track",
    "data-orientation": "vertical",
    "data-clipped": context.state.clipped ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    style: {
      ...style,
      "--level-meter-max-value": context.state.maxValue,
      "--level-meter-max-percent": context.state.maxPercent,
      "--level-meter-channel-count": context.state.channels.length,
    } as CSSProperties,
  });

  return renderElement("div", render, trackProps, renderState);
});
