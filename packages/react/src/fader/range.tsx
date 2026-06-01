import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useFaderContext } from "./context.tsx";
import type { FaderRangeProps } from "./types.ts";

export const Range = forwardRef<HTMLSpanElement, FaderRangeProps>(function Range(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useFaderContext("Fader.Range");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const rangeProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "range",
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-unity": context.state.value === context.state.unity ? "" : undefined,
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--fader-value": context.state.value,
      "--fader-percent": context.state.percent,
      "--fader-unity-percent": context.state.unityPercent,
      "--fader-gain": context.state.gain,
    } as CSSProperties,
  });

  return renderElement("span", render, rangeProps, renderState);
});
