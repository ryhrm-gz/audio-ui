import { forwardRef } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { Band } from "./band.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveBandsProps } from "./types.ts";

export const Bands = forwardRef<HTMLDivElement, EQCurveBandsProps>(function Bands(props, ref) {
  const { render, children, ...elementProps } = props;
  const context = useEQCurveContext("EQCurve.Bands");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.draggingBand !== null,
  });
  const content =
    typeof children === "function"
      ? context.state.bands.map((band) => children(band, context.state))
      : (children ?? context.state.bands.map((band) => <Band key={band.id} band={band} />));
  const bandsProps = mergeProps(elementProps, {
    ref,
    "data-part": "bands",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.draggingBand !== null ? "" : undefined,
  });

  return renderElement("div", render, bandsProps, renderState, content);
});
