import { getSliderValueFromLinearDrag, getSliderValueFromPoint } from "@audio-ui/core";
import { forwardRef, useCallback, useRef, type CSSProperties, type PointerEvent } from "react";
import { useComposedRefs } from "../shared/refs.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import type { SliderTrackProps } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  currentValue: number;
  startValue: number;
  startPointX: number;
  startPointY: number;
  fine: boolean;
  fineStartValue?: number;
  fineStartPointX?: number;
  fineStartPointY?: number;
}

export const Track = forwardRef<HTMLDivElement, SliderTrackProps>(function Track(props, ref) {
  const {
    render,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    style,
    ...elementProps
  } = props;
  const context = useSliderContext("Slider.Track");
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, context.trackRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;
  const allowTrackClick = context.allowTrackClick;

  const getValueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();

      return getSliderValueFromPoint(
        {
          trackX: rect.left,
          trackY: rect.top,
          trackWidth: rect.width,
          trackHeight: rect.height,
          pointX: event.clientX,
          pointY: event.clientY,
        },
        context.state,
      );
    },
    [context.state],
  );

  const getValueFromDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>, activeDrag: ActiveDrag) => {
      const fine = context.fineControl && event.shiftKey;

      if (!fine) {
        return {
          value: getValueFromPointer(event),
          fine,
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
          fine,
          fineStartValue: activeDrag.currentValue,
          fineStartPointX: event.clientX,
          fineStartPointY: event.clientY,
        };
      }

      const rect = event.currentTarget.getBoundingClientRect();
      return {
        value: getSliderValueFromLinearDrag(
          {
            trackX: rect.left,
            trackY: rect.top,
            trackWidth: rect.width,
            trackHeight: rect.height,
            startValue: activeDrag.fineStartValue,
            startPointX: activeDrag.fineStartPointX,
            startPointY: activeDrag.fineStartPointY,
            pointX: event.clientX,
            pointY: event.clientY,
          },
          context.state,
          { fine },
        ),
        fine,
        fineStartValue: activeDrag.fineStartValue,
        fineStartPointX: activeDrag.fineStartPointX,
        fineStartPointY: activeDrag.fineStartPointY,
      };
    },
    [context.fineControl, context.state, getValueFromPointer],
  );

  const releasePointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);

    if (event.defaultPrevented || disabled || readOnly || event.button !== 0) {
      return;
    }

    if (!allowTrackClick && !isThumbPointerTarget(event)) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const fine = context.fineControl && event.shiftKey;
    const nextValue = allowTrackClick ? getValueFromPointer(event) : context.state.value;
    activeDragRef.current = {
      pointerId: event.pointerId,
      currentValue: nextValue,
      startValue: nextValue,
      startPointX: event.clientX,
      startPointY: event.clientY,
      fine,
      fineStartValue: fine ? nextValue : undefined,
      fineStartPointX: fine ? event.clientX : undefined,
      fineStartPointY: fine ? event.clientY : undefined,
    };
    context.setDragging(true);

    if (allowTrackClick) {
      context.setValue(nextValue, { fine });
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);

    const activeDrag = activeDragRef.current;

    if (
      event.defaultPrevented ||
      disabled ||
      readOnly ||
      !context.dragging ||
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
    context.setValue(dragValue.value, { fine: dragValue.fine });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    const activeDrag = activeDragRef.current;
    const dragValue = activeDrag?.currentValue ?? context.state.value;
    releasePointerCapture(event);
    context.setDragging(false);
    activeDragRef.current = null;
    context.commitValue(dragValue, { fine: activeDrag?.fine });
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    releasePointerCapture(event);
    context.setDragging(false);
    activeDragRef.current = null;
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const trackProps = mergeProps(elementProps, {
    ref: composedRef,
    "data-part": "track",
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--slider-value": context.state.value,
      "--slider-percent": context.state.percent,
    } as CSSProperties,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  });

  return renderElement("div", render, trackProps, renderState);
});

function isThumbPointerTarget(event: PointerEvent<HTMLDivElement>) {
  if (!(event.target instanceof Element)) {
    return false;
  }

  const thumb = event.target.closest('[data-part="thumb"]');
  return thumb !== null && event.currentTarget.contains(thumb);
}
