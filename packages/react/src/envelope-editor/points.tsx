import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import { Point } from "./point.tsx";
import type { EnvelopeEditorPointsProps } from "./types.ts";

export const Points = forwardRef<HTMLDivElement, EnvelopeEditorPointsProps>(
  function Points(props, ref) {
    const { render, children, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.Points");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.draggingPoint !== null,
    });
    const content =
      typeof children === "function"
        ? context.state.points.map((point) => children(point, context.state))
        : (children ??
          context.state.points.map((point) => <Point key={point.id} point={point.id} />));
    const pointsProps = mergeProps(elementProps, {
      ref,
      "data-part": "points",
      "data-disabled": context.disabled ? "" : undefined,
      "data-readonly": context.readOnly ? "" : undefined,
      "data-dragging": context.draggingPoint !== null ? "" : undefined,
    });

    return renderElement("div", render, pointsProps, renderState, content);
  },
);
