import { createLevelMeterState } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, useMemo } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { LevelMeterContext, type LevelMeterContextValue } from "./context.tsx";
import type { LevelMeterRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, LevelMeterRootProps>(function Root(props, ref) {
  const {
    value,
    peak,
    min,
    max,
    clip,
    channels,
    scale,
    segments,
    disabled = false,
    children,
    render,
    style,
    ...elementProps
  } = props;
  const state = useMemo(
    () => createLevelMeterState(value, { min, max, clip, channels, peak, scale, segments }),
    [value, min, max, clip, channels, peak, scale, segments],
  );
  const contextValue = useMemo<LevelMeterContextValue>(
    () => ({
      state,
      disabled,
    }),
    [state, disabled],
  );
  const renderState = getRenderState(state, { disabled, readOnly: false, dragging: false });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    role: "meter",
    "aria-valuemin": state.min,
    "aria-valuemax": state.max,
    "aria-valuenow": state.maxValue,
    "aria-valuetext": `${state.maxValue.toFixed(1)} dB`,
    "data-audio-ui": "level-meter",
    "data-orientation": "vertical",
    "data-clipped": state.clipped ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    style: {
      ...style,
      "--level-meter-max-value": state.maxValue,
      "--level-meter-max-percent": state.maxPercent,
      "--level-meter-channel-count": state.channels.length,
    } as CSSProperties,
  });

  return (
    <LevelMeterContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </LevelMeterContext.Provider>
  );
});
