import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, SpectrumAnalyzerValueProps>(
  function Value(props, ref) {
    const { render, children, format, ...elementProps } = props;
    const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.Value");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const content =
      typeof children === "function"
        ? children(renderState)
        : (children ??
          format?.(context.state.peak, context.state) ??
          getDefaultValueText(context.state.peak));
    const valueProps = mergeProps(elementProps, {
      ref,
      id: context.valueId,
      "data-part": "value",
      "data-empty": context.state.empty ? "" : undefined,
      "data-disabled": context.disabled ? "" : undefined,
    });

    return renderElement("span", render, valueProps, renderState, content);
  },
);

function getDefaultValueText(peak: ReturnType<typeof useSpectrumAnalyzerContext>["state"]["peak"]) {
  if (peak === null) {
    return "No data";
  }

  return `${peak.magnitude.toFixed(1)} dB @ ${Math.round(peak.frequency)} Hz`;
}
