import { forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useLevelMeterContext } from "./context.tsx";
import type { LevelMeterScaleProps } from "./types.ts";

export const Scale = forwardRef<HTMLSpanElement, LevelMeterScaleProps>(function Scale(props, ref) {
  const { render, children, ...elementProps } = props;
  const context = useLevelMeterContext("LevelMeter.Scale");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: false,
    dragging: false,
  });
  const content = context.state.scale.map((mark) => (
    <span
      key={`${mark.value}-${mark.percent}`}
      data-part="scale-mark"
      style={
        {
          "--level-meter-mark-value": mark.value,
          "--level-meter-mark-percent": mark.percent,
        } as CSSProperties
      }
    >
      {typeof children === "function" ? children(mark, renderState) : (children ?? mark.label)}
    </span>
  ));
  const scaleProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "scale",
    "data-orientation": context.state.orientation,
    "data-disabled": context.disabled ? "" : undefined,
  });

  return renderElement("span", render, scaleProps, renderState, content);
});
