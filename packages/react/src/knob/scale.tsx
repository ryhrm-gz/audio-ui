import { forwardRef, type CSSProperties } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobScaleProps } from "./types.ts";

export const Scale = forwardRef<HTMLSpanElement, KnobScaleProps>(function Scale(props, ref) {
  const { render, children, style, ...elementProps } = props;
  const context = useKnobContext("Knob.Scale");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const scaleProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "scale",
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

  return renderElement("span", render, scaleProps, renderState, content);
});
