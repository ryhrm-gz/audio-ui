import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useFaderContext } from "./context.tsx";
import type { FaderScaleProps } from "./types.ts";

export const Scale = forwardRef<HTMLSpanElement, FaderScaleProps>(function Scale(props, ref) {
  const { render, children, style, ...elementProps } = props;
  const context = useFaderContext("Fader.Scale");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content =
    typeof children === "function"
      ? renderMarks(context.state.scale.map((mark) => children(mark, renderState)))
      : (children ?? renderMarks(context.state.scale.map((mark) => mark.label)));
  const scaleProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "scale",
    "data-orientation": "vertical",
    "data-inverted": context.state.inverted ? "" : undefined,
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

  return renderElement("span", render, scaleProps, renderState, content);

  function renderMarks(labels: ReactNode[]) {
    return context.state.scale.map((mark, index) => (
      <span
        data-part="scale-mark"
        data-unity={mark.value === context.state.unity ? "" : undefined}
        key={`${mark.value}:${mark.percent}`}
        style={
          {
            "--fader-mark-value": mark.value,
            "--fader-mark-percent": mark.percent,
          } as CSSProperties
        }
      >
        {labels[index]}
      </span>
    ));
  }
});
