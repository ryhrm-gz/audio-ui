import { forwardRef, type CSSProperties } from "react";
import { useKnobContext } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobMarksProps } from "./types.ts";

export const Marks = forwardRef<HTMLSpanElement, KnobMarksProps>(function Marks(props, ref) {
  const { render, children, style, ...elementProps } = props;
  const context = useKnobContext("Knob.Marks");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const marksProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "marks",
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

  return renderElement("span", render, marksProps, renderState, content);
});
