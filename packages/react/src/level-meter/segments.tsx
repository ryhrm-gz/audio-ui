import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterSegmentsProps } from "./types.ts";

export const Segments = forwardRef<HTMLSpanElement, LevelMeterSegmentsProps>(
  function Segments(props, ref) {
    const { channel, render, children, ...elementProps } = props;
    const context = useLevelMeterContext("LevelMeter.Segments");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const channelPercent =
      channel === undefined ? 1 : (context.state.channels[channel]?.percent ?? 0);
    const content = context.state.segments.map((segment, index) => {
      const startPercent =
        channel === undefined
          ? segment.startPercent
          : getFillPercent(segment.startPercent, channelPercent);
      const endPercent =
        channel === undefined
          ? segment.endPercent
          : getFillPercent(segment.endPercent, channelPercent);
      const sizePercent = Math.max(0, endPercent - startPercent);

      return (
        <span
          key={`${segment.id}-${segment.from}-${segment.to}`}
          data-part="segment"
          data-segment={segment.id}
          data-segment-index={index}
          style={
            {
              "--level-meter-segment-from": segment.from,
              "--level-meter-segment-to": segment.to,
              "--level-meter-segment-start-percent": startPercent,
              "--level-meter-segment-end-percent": endPercent,
              "--level-meter-segment-size-percent": sizePercent,
            } as CSSProperties
          }
        >
          {typeof children === "function" ? children(segment, renderState) : children}
        </span>
      );
    });
    const segmentsProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "segments",
      "data-channel": channel,
      "data-disabled": context.disabled ? "" : undefined,
    });

    return renderElement("span", render, segmentsProps, renderState, content);
  },
);

function getFillPercent(percent: number, channelPercent: number) {
  if (channelPercent <= 0) {
    return 0;
  }

  return Math.min(percent, channelPercent) / channelPercent;
}
