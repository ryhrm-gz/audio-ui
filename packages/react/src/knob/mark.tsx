import { getKnobMarkPoint } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobMarkProps, KnobMarkState } from "./types.ts";

export const Mark = forwardRef<HTMLSpanElement, KnobMarkProps>(function Mark(props, ref) {
  const { render, children, style, value, ...elementProps } = props;
  const context = useKnobContext("Knob.Mark");
  const mark = getKnobMarkPoint(value, context.state);
  const knobRenderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const markRenderState = getRenderState<KnobMarkState>(
    { ...context.state, mark },
    {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.dragging,
    },
  );
  const content = typeof children === "function" ? children(mark, knobRenderState) : children;
  const markProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "mark",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--knob-mark-value": mark.value,
      "--knob-mark-percent": mark.percent,
      "--knob-mark-angle": `${mark.angle}deg`,
      "--knob-mark-angle-inverse": `${-mark.angle}deg`,
      "--knob-mark-x": mark.x,
      "--knob-mark-y": mark.y,
    } as CSSProperties,
  });

  return renderElement("span", render, markProps, markRenderState, content);
});
