import { getKnobTickPoints } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobTicksProps } from "./types.ts";

export const Ticks = forwardRef<HTMLSpanElement, KnobTicksProps>(function Ticks(props, ref) {
  const { render, children, count, style, ...elementProps } = props;
  const context = useKnobContext("Knob.Ticks");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const ticks = getKnobTickPoints(count, context.state);
  const content = ticks.map((tick) => (
    <span
      data-part="tick"
      key={`${tick.value}:${tick.percent}`}
      style={
        {
          "--knob-mark-value": tick.value,
          "--knob-mark-percent": tick.percent,
          "--knob-mark-angle": `${tick.angle}deg`,
          "--knob-mark-angle-inverse": `${-tick.angle}deg`,
          "--knob-mark-x": tick.x,
          "--knob-mark-y": tick.y,
        } as CSSProperties
      }
    >
      {typeof children === "function" ? children(tick, renderState) : children}
    </span>
  ));
  const ticksProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "ticks",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--knob-value": context.state.value,
      "--knob-percent": context.state.percent,
      "--knob-angle": `${context.state.angle}deg`,
    } as CSSProperties,
  });

  return renderElement("span", render, ticksProps, renderState, content);
});
