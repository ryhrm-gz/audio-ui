import { createCompressorCurveState, defaultCompressorCurveValue } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useId, useMemo, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { CompressorCurveContext, type CompressorCurveContextValue } from "./context.tsx";
import type { CompressorCurveRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, CompressorCurveRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue = defaultCompressorCurveValue,
    minInput,
    maxInput,
    minOutput,
    maxOutput,
    minThreshold,
    maxThreshold,
    minRatio,
    maxRatio,
    minKnee,
    maxKnee,
    minMakeupGain,
    maxMakeupGain,
    stepThreshold,
    stepRatio,
    stepKnee,
    stepMakeupGain,
    curveResolution,
    disabled = false,
    name,
    required,
    children,
    render,
    style,
    ...elementProps
  } = props;
  const rawValue = value ?? defaultValue;
  const state = useMemo(
    () =>
      createCompressorCurveState(rawValue, {
        minInput,
        maxInput,
        minOutput,
        maxOutput,
        minThreshold,
        maxThreshold,
        minRatio,
        maxRatio,
        minKnee,
        maxKnee,
        minMakeupGain,
        maxMakeupGain,
        stepThreshold,
        stepRatio,
        stepKnee,
        stepMakeupGain,
        curveResolution,
      }),
    [
      rawValue,
      minInput,
      maxInput,
      minOutput,
      maxOutput,
      minThreshold,
      maxThreshold,
      minRatio,
      maxRatio,
      minKnee,
      maxKnee,
      minMakeupGain,
      maxMakeupGain,
      stepThreshold,
      stepRatio,
      stepKnee,
      stepMakeupGain,
      curveResolution,
    ],
  );
  const valueId = useId();

  const contextValue = useMemo<CompressorCurveContextValue>(
    () => ({
      state,
      disabled,
      valueId,
      name,
      required,
    }),
    [state, disabled, valueId, name, required],
  );
  const renderState = getRenderState(state, {
    disabled,
    readOnly: false,
    dragging: false,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "compressor-curve",
    "data-disabled": disabled ? "" : undefined,
    style: {
      ...style,
      "--compressor-curve-min-input": state.minInput,
      "--compressor-curve-max-input": state.maxInput,
      "--compressor-curve-min-output": state.minOutput,
      "--compressor-curve-max-output": state.maxOutput,
      "--compressor-curve-threshold": state.value.threshold,
      "--compressor-curve-ratio": state.value.ratio,
      "--compressor-curve-knee": state.value.knee,
      "--compressor-curve-makeup-gain": state.value.makeupGain,
    } as CSSProperties,
  });

  return (
    <CompressorCurveContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </CompressorCurveContext.Provider>
  );
});
