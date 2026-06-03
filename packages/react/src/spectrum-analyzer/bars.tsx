import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSpectrumAnalyzerContext } from "./context.tsx";
import type { SpectrumAnalyzerBarsProps } from "./types.ts";

export const Bars = forwardRef<HTMLSpanElement, SpectrumAnalyzerBarsProps>(
  function Bars(props, ref) {
    const { render, children, ...elementProps } = props;
    const context = useSpectrumAnalyzerContext("SpectrumAnalyzer.Bars");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: false,
      dragging: false,
    });
    const content = context.state.bins.map((bin) => (
      <span
        key={bin.id}
        data-part="bar"
        data-bin={bin.id}
        data-bin-index={bin.index}
        data-clipped={bin.clipped ? "" : undefined}
        data-out-of-range={bin.outOfRange ? "" : undefined}
        style={
          {
            "--spectrum-analyzer-bin-index": bin.index,
            "--spectrum-analyzer-bin-frequency": bin.frequency,
            "--spectrum-analyzer-bin-magnitude": bin.magnitude,
            "--spectrum-analyzer-bin-x": bin.x,
            "--spectrum-analyzer-bin-y": bin.y,
            "--spectrum-analyzer-bin-start": bin.barStart,
            "--spectrum-analyzer-bin-end": bin.barEnd,
            "--spectrum-analyzer-bin-width": bin.barWidth,
          } as CSSProperties
        }
      >
        {typeof children === "function" ? children(bin, renderState) : children}
      </span>
    ));
    const barsProps = mergeProps(elementProps, {
      ref,
      "aria-hidden": true,
      "data-part": "bars",
      "data-frequency-scale": context.state.frequencyScale,
      "data-empty": context.state.empty ? "" : undefined,
      "data-disabled": context.disabled ? "" : undefined,
    });

    return renderElement("span", render, barsProps, renderState, content);
  },
);
