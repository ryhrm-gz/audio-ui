import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorValueProps } from "./types.ts";

export const Value = forwardRef<HTMLSpanElement, EnvelopeEditorValueProps>(
  function Value(props, ref) {
    const { render, children, format, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.Value");
    const renderState = getRenderState(context.state, {
      disabled: context.disabled,
      readOnly: context.readOnly,
      dragging: context.draggingPoint !== null,
    });
    const content =
      typeof children === "function"
        ? children(renderState)
        : (children ??
          format?.(context.state.value, context.state) ??
          `A ${context.state.value.attack}s / D ${context.state.value.decay}s / S ${context.state.value.sustain} / R ${context.state.value.release}s`);
    const valueProps = mergeProps(elementProps, {
      ref,
      id: context.valueId,
      "data-part": "value",
      "data-disabled": context.disabled ? "" : undefined,
      "data-readonly": context.readOnly ? "" : undefined,
      "data-dragging": context.draggingPoint !== null ? "" : undefined,
    });

    return renderElement("span", render, valueProps, renderState, content);
  },
);
