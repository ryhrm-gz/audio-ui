import {
  getEnvelopeEditorValueFromPointRect,
  getFineStep,
  getNextEnvelopeEditorKeyboardValue,
  type EnvelopeEditorPoint as CoreEnvelopeEditorPoint,
  type EnvelopeEditorValue,
} from "@ryhrm-gz/audio-ui-core";
import {
  forwardRef,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorPointProps, EnvelopeEditorPointState } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  currentValue: EnvelopeEditorValue;
  fine: boolean;
  startValue: EnvelopeEditorValue;
  startPointX: number;
  startPointY: number;
  fineStartValue?: EnvelopeEditorValue;
  fineStartPointX?: number;
  fineStartPointY?: number;
}

export const Point = forwardRef<HTMLSpanElement, EnvelopeEditorPointProps>(
  function Point(props, ref) {
    const {
      point: pointId,
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
    const context = useEnvelopeEditorContext("EnvelopeEditor.Point");
    const point = context.state.points.find((nextPoint) => nextPoint.id === pointId);
    const activeDragRef = useRef<ActiveDrag | null>(null);
    const disabled = context.disabled;
    const readOnly = context.readOnly;

    if (point === undefined) {
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

      return getEnvelopeEditorValueFromPointRect(
        point.id,
        {
          graphX: rect.left,
          graphY: rect.top,
          graphWidth: rect.width,
          graphHeight: rect.height,
          pointX: clientX,
          pointY: clientY,
        },
        context.state.value,
        {
          ...context.state,
          valueStepTime: fine ? getFineStep(context.state.stepTime) : undefined,
          valueStepLevel: fine ? getFineStep(context.state.stepLevel) : undefined,
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
      const deltaX = event.clientX - activeDrag.fineStartPointX;
      const deltaY = event.clientY - activeDrag.fineStartPointY;
      const scaledDeltaX = deltaX * 0.1;
      const scaledDeltaY = deltaY * 0.1;
      const pointX = activeDrag.fineStartPointX + scaledDeltaX;
      const pointY = activeDrag.fineStartPointY + scaledDeltaY;

      const nextValue = getEnvelopeEditorValueFromPointRect(
        point.id,
        {
          graphX: rect.left,
          graphY: rect.top,
          graphWidth: rect.width,
          graphHeight: rect.height,
          pointX,
          pointY,
        },
        activeDrag.fineStartValue,
        {
          ...context.state,
          valueStepTime: getFineStep(context.state.stepTime),
          valueStepLevel: getFineStep(context.state.stepLevel),
        },
      );

      return {
        value: nextValue,
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
      const nextValue = getNextEnvelopeEditorKeyboardValue(
        context.state.value,
        point.id,
        event.key,
        context.state,
        { fine },
      );

      if (nextValue === undefined) {
        return;
      }

      event.preventDefault();
      context.setValue(nextValue, { fine, activePoint: point.id });
      context.commitValue(nextValue, { fine, activePoint: point.id });
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
        startValue: context.state.value,
        startPointX: event.clientX,
        startPointY: event.clientY,
        fineStartValue: fine ? nextValue : undefined,
        fineStartPointX: fine ? event.clientX : undefined,
        fineStartPointY: fine ? event.clientY : undefined,
      };
      context.setDraggingPoint(point.id);
      context.setValue(nextValue, { fine, activePoint: point.id });
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
      context.setValue(dragValue.value, { fine: dragValue.fine, activePoint: point.id });
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

      context.setDraggingPoint(null);
      activeDragRef.current = null;
      context.commitValue(activeDrag.currentValue, { fine: activeDrag.fine, activePoint: null });
    };

    const handlePointerCancel = (event: PointerEvent<HTMLSpanElement>) => {
      onPointerCancel?.(event);

      if (event.defaultPrevented || disabled || readOnly) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      context.setDraggingPoint(null);
      activeDragRef.current = null;
    };

    const state = {
      ...context.state,
      point,
    } satisfies EnvelopeEditorPointState;
    const isDragging = context.draggingPoint === point.id;
    const renderState = getRenderState(state, {
      disabled,
      readOnly,
      dragging: isDragging,
    });
    const describedBy =
      ariaDescribedBy === undefined ? context.valueId : `${context.valueId} ${ariaDescribedBy}`;
    const pointProps = mergeProps(elementProps, {
      ref,
      role: "slider",
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled || undefined,
      "aria-readonly": readOnly || undefined,
      "aria-label":
        elementProps["aria-label"] === undefined && elementProps["aria-labelledby"] === undefined
          ? getDefaultAriaLabel(point)
          : undefined,
      "aria-valuemin": getAriaValueMin(point, context.state.minTime, context.state.minLevel),
      "aria-valuemax": getAriaValueMax(point, context.state.maxTime, context.state.maxLevel),
      "aria-valuenow": getAriaValueNow(point),
      "aria-valuetext": getAriaValueText(point, context.state.value),
      "aria-describedby": describedBy,
      "data-part": "point",
      "data-point": point.id,
      "data-phase": point.phase,
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-dragging": isDragging ? "" : undefined,
      style: {
        ...style,
        "--envelope-point-x": point.x,
        "--envelope-point-y": point.y,
      } as CSSProperties,
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    });

    return renderElement("span", render, pointProps, renderState);
  },
);

function getAriaValueMin(point: CoreEnvelopeEditorPoint, minTime: number, minLevel: number) {
  return point.id === "sustain" ? minLevel : minTime;
}

function getAriaValueMax(point: CoreEnvelopeEditorPoint, maxTime: number, maxLevel: number) {
  return point.id === "sustain" ? maxLevel : maxTime;
}

function getAriaValueNow(point: CoreEnvelopeEditorPoint) {
  return point.id === "sustain" ? point.level : point.time;
}

function getAriaValueText(point: CoreEnvelopeEditorPoint, value: EnvelopeEditorValue) {
  switch (point.id) {
    case "attack":
      return `attack ${value.attack}s`;
    case "sustain":
      return `sustain ${value.sustain}, decay ${value.decay}s`;
    case "release":
      return `release ${value.release}s`;
  }
}

function getDefaultAriaLabel(point: CoreEnvelopeEditorPoint) {
  switch (point.id) {
    case "attack":
      return "Attack time";
    case "sustain":
      return "Sustain level";
    case "release":
      return "Release time";
  }
}
