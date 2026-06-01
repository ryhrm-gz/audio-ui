import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useCompressorCurveContext } from "./context.tsx";
import type { CompressorCurveValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, CompressorCurveValueProps>(
  function Value(props, ref) {
    const { render, children, format, ...elementProps } = props;
    const context = useCompressorCurveContext("CompressorCurve.Value");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const value = context.state.value;
    const content =
      typeof children === "function"
        ? children(renderState)
        : (children ??
          format?.(value, context.state) ??
          `${value.threshold} dB, ${value.ratio}:1, knee ${value.knee} dB, makeup ${value.makeupGain} dB`);
    const valueProps = mergeProps(elementProps, {
      ref,
      id: context.valueId,
      "data-part": "value",
      "data-disabled": context.disabled ? "" : undefined,
    });

    return renderElement("span", render, valueProps, renderState, content);
  },
);
