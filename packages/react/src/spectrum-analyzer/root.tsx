import { createSpectrumAnalyzerState } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useId, useMemo, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { SpectrumAnalyzerContext, type SpectrumAnalyzerContextValue } from "./context.tsx";
import type { SpectrumAnalyzerRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, SpectrumAnalyzerRootProps>(
  function Root(props, ref) {
    const {
      value,
      minFrequency,
      maxFrequency,
      minMagnitude,
      maxMagnitude,
      frequencyScale,
      disabled = false,
      name,
      required,
      children,
      render,
      style,
      ...elementProps
    } = props;
    const state = useMemo(
      () =>
        createSpectrumAnalyzerState(value, {
          minFrequency,
          maxFrequency,
          minMagnitude,
          maxMagnitude,
          frequencyScale,
        }),
      [value, minFrequency, maxFrequency, minMagnitude, maxMagnitude, frequencyScale],
    );
    const valueId = useId();
    const contextValue = useMemo<SpectrumAnalyzerContextValue>(
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
      role: "img",
      "aria-valuetext":
        state.peak === null
          ? "No spectrum data"
          : `${state.peak.magnitude.toFixed(1)} dB at ${Math.round(state.peak.frequency)} Hz`,
      "data-audio-ui": "spectrum-analyzer",
      "data-frequency-scale": state.frequencyScale,
      "data-empty": state.empty ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      style: {
        ...style,
        "--spectrum-analyzer-bin-count": state.binCount,
        "--spectrum-analyzer-min-frequency": state.minFrequency,
        "--spectrum-analyzer-max-frequency": state.maxFrequency,
        "--spectrum-analyzer-min-magnitude": state.minMagnitude,
        "--spectrum-analyzer-max-magnitude": state.maxMagnitude,
        "--spectrum-analyzer-peak-frequency": state.peak?.frequency ?? state.minFrequency,
        "--spectrum-analyzer-peak-magnitude": state.peak?.magnitude ?? state.minMagnitude,
      } as CSSProperties,
    });

    return (
      <SpectrumAnalyzerContext.Provider value={contextValue}>
        {renderElement("div", render, rootProps, renderState, content)}
      </SpectrumAnalyzerContext.Provider>
    );
  },
);
