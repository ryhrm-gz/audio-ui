import { forwardRef, type CSSProperties } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobThumbProps } from "./types.ts";

export const Thumb = forwardRef<HTMLSpanElement, KnobThumbProps>(function Thumb(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useKnobContext("Knob.Thumb");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const thumbProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "thumb",
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

  return renderElement("span", render, thumbProps, renderState);
});
