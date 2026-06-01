import {
  getEQCurveValueFromBandRect,
  getFineStep,
  getNextEQCurveKeyboardValue,
  type EQCurveBandState,
  type EQCurveValue,
} from "@ryhrm-gz/audio-ui-core";
import {
  forwardRef,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEQCurveContext } from "./context.tsx";
import type { EQCurveBandProps, EQCurveBandRenderState } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  currentValue: EQCurveValue;
  fine: boolean;
  fineStartValue?: EQCurveValue;
  fineStartPointX?: number;
  fineStartPointY?: number;
}

export const Band = forwardRef<HTMLSpanElement, EQCurveBandProps>(function Band(props, ref) {
  const {
    band: bandProp,
    render,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    style,
    "aria-describedby": ariaDescribedBy,
    ...elementProps
  } = props;
  const context = useEQCurveContext("EQCurve.Band");
  const band = resolveBand(context.state.bands, bandProp);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  if (band === undefined) {
    return null;
  }

  const getValueFromPointer = (
    clientX: number,
    clientY: number,
    targetRect: DOMRect,
    fine: boolean,
  ) => {
    const graph = context.graphRef.current;
    const rect = graph?.getBoundingClientRect() ?? targetRect;

    return getEQCurveValueFromBandRect(
      context.state.value,
      band.id,
      {
        graphX: rect.left,
        graphY: rect.top,
        graphWidth: rect.width,
        graphHeight: rect.height,
        pointX: clientX,
        pointY: clientY,
      },
      {
        ...context.state,
        valueStepFrequency: fine ? getFineStep(context.state.stepFrequency) : undefined,
        valueStepGain: fine ? getFineStep(context.state.stepGain) : undefined,
      },
    );
  };

  const getValueFromDrag = (event: PointerEvent<HTMLSpanElement>, activeDrag: ActiveDrag) => {
    const fine = context.fineControl && event.shiftKey;

    if (!fine) {
      return {
        value: getValueFromPointer(
          event.clientX,
          event.clientY,
          event.currentTarget.getBoundingClientRect(),
          false,
        ),
        fine: false,
        fineStartValue: undefined,
        fineStartPointX: undefined,
        fineStartPointY: undefined,
      };
    }

    if (
      activeDrag.fineStartValue === undefined ||
      activeDrag.fineStartPointX === undefined ||
      activeDrag.fineStartPointY === undefined
    ) {
      return {
        value: activeDrag.currentValue,
        fine: true,
        fineStartValue: activeDrag.currentValue,
        fineStartPointX: event.clientX,
        fineStartPointY: event.clientY,
      };
    }

    const graph = context.graphRef.current;
    const rect = graph?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const pointX = activeDrag.fineStartPointX + (event.clientX - activeDrag.fineStartPointX) * 0.1;
    const pointY = activeDrag.fineStartPointY + (event.clientY - activeDrag.fineStartPointY) * 0.1;

    return {
      value: getEQCurveValueFromBandRect(
        activeDrag.fineStartValue,
        band.id,
        {
          graphX: rect.left,
          graphY: rect.top,
          graphWidth: rect.width,
          graphHeight: rect.height,
          pointX,
          pointY,
        },
        {
          ...context.state,
          valueStepFrequency: getFineStep(context.state.stepFrequency),
          valueStepGain: getFineStep(context.state.stepGain),
        },
      ),
      fine: true,
      fineStartValue: activeDrag.fineStartValue,
      fineStartPointX: activeDrag.fineStartPointX,
      fineStartPointY: activeDrag.fineStartPointY,
    };
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const fine = context.fineControl && event.shiftKey;
    const nextValue = getNextEQCurveKeyboardValue(
      context.state.value,
      band.id,
      event.key,
      context.state,
      { fine, q: event.altKey },
    );

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setValue(nextValue, { fine, activeBand: band.id });
    context.commitValue(nextValue, { fine, activeBand: band.id });
  };

  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);

    if (event.defaultPrevented || disabled || readOnly || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const fine = context.fineControl && event.shiftKey;
    const nextValue = getValueFromPointer(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
      fine,
    );
    activeDragRef.current = {
      pointerId: event.pointerId,
      currentValue: nextValue,
      fine,
      fineStartValue: fine ? nextValue : undefined,
      fineStartPointX: fine ? event.clientX : undefined,
      fineStartPointY: fine ? event.clientY : undefined,
    };
    context.setDraggingBand(band.id);
    context.setValue(nextValue, { fine, activeBand: band.id });
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerMove?.(event);

    const activeDrag = activeDragRef.current;

    if (
      event.defaultPrevented ||
      disabled ||
      readOnly ||
      activeDrag === null ||
      activeDrag.pointerId !== event.pointerId
    ) {
      return;
    }

    const dragValue = getValueFromDrag(event, activeDrag);
    activeDragRef.current = {
      ...activeDrag,
      currentValue: dragValue.value,
      fine: dragValue.fine,
      fineStartValue: dragValue.fineStartValue,
      fineStartPointX: dragValue.fineStartPointX,
      fineStartPointY: dragValue.fineStartPointY,
    };
    context.setValue(dragValue.value, { fine: dragValue.fine, activeBand: band.id });
  };

  const handlePointerUp = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerUp?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const activeDrag = activeDragRef.current;

    if (activeDrag === null || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    context.setDraggingBand(null);
    activeDragRef.current = null;
    context.commitValue(activeDrag.currentValue, { fine: activeDrag.fine, activeBand: null });
  };

  const handlePointerCancel = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerCancel?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    context.setDraggingBand(null);
    activeDragRef.current = null;
  };

  const isDragging = context.draggingBand === band.id;
  const state = {
    ...context.state,
    band,
  } satisfies EQCurveBandRenderState;
  const renderState = getRenderState(state, { disabled, readOnly, dragging: isDragging });
  const describedBy =
    ariaDescribedBy === undefined ? context.valueId : `${context.valueId} ${ariaDescribedBy}`;
  const bandProps = mergeProps(elementProps, {
    ref,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-readonly": readOnly || undefined,
    "aria-label":
      elementProps["aria-label"] === undefined && elementProps["aria-labelledby"] === undefined
        ? `${getBandTypeLabel(band)} band`
        : undefined,
    "aria-valuemin": context.state.minFrequency,
    "aria-valuemax": context.state.maxFrequency,
    "aria-valuenow": band.frequency,
    "aria-valuetext": `${Math.round(band.frequency)} Hz, ${band.gain} dB, Q ${band.q}`,
    "aria-describedby": describedBy,
    "data-part": "band",
    "data-band-id": band.id,
    "data-band-type": band.type,
    "data-enabled": band.enabled ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": isDragging ? "" : undefined,
    style: {
      ...style,
      "--eq-curve-band-frequency": band.frequency,
      "--eq-curve-band-gain": band.gain,
      "--eq-curve-band-q": band.q,
      "--eq-curve-band-x": band.x,
      "--eq-curve-band-y": band.y,
    } as CSSProperties,
    onKeyDown: handleKeyDown,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  });

  return renderElement("span", render, bandProps, renderState);
});

function resolveBand(bands: EQCurveBandState[], band: EQCurveBandProps["band"]) {
  const id = typeof band === "string" ? band : band.id;
  return bands.find((nextBand) => nextBand.id === id);
}

function getBandTypeLabel(band: EQCurveBandState) {
  switch (band.type) {
    case "bell":
      return "Bell";
    case "low-shelf":
      return "Low shelf";
    case "high-shelf":
      return "High shelf";
    case "low-pass":
      return "Low pass";
    case "high-pass":
      return "High pass";
  }
}
