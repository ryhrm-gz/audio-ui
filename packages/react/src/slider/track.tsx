import {
  getClosestSliderThumbIndexFromPoint,
  getSliderValueFromLinearDrag,
  getSliderValueFromPoint,
  type SliderThumbIndex,
  type SliderValue,
} from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useRef, type MouseEvent, type PointerEvent } from "react";
import { isFineControlEnabled } from "../shared/fine-control.ts";
import { useComposedRefs } from "../shared/refs.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useSliderContext } from "./context.tsx";
import { getSliderStyle } from "./root.tsx";
import type { SliderTrackProps } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  activeThumb: SliderThumbIndex;
  currentValue: SliderValue;
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
    onDoubleClick,
    style,
    ...elementProps
  } = props;
  const context = useSliderContext("Slider.Track");
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, context.trackRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;
  const allowTrackClick = context.allowTrackClick;

  const getPoint = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      trackX: rect.left,
      trackY: rect.top,
      trackWidth: rect.width,
      trackHeight: rect.height,
      pointX: event.clientX,
      pointY: event.clientY,
    };
  };

  const getValueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>, activeThumb: SliderThumbIndex) => {
      return getSliderValueFromPoint(
        getPoint(event),
        context.state.value,
        activeThumb,
        context.state,
      );
    },
    [context.state],
  );

  const getValueFromDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>, activeDrag: ActiveDrag) => {
      const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;

      if (!fine) {
        return {
          value: getValueFromPointer(event, activeDrag.activeThumb),
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
        const currentThumbValue = Array.isArray(activeDrag.currentValue)
          ? activeDrag.currentValue[activeDrag.activeThumb]
          : activeDrag.currentValue;

        return {
          value: activeDrag.currentValue,
          fine,
          fineStartValue: currentThumbValue,
          fineStartPointX: event.clientX,
          fineStartPointY: event.clientY,
        };
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const drag = {
        trackX: rect.left,
        trackY: rect.top,
        trackWidth: rect.width,
        trackHeight: rect.height,
        startValue: activeDrag.fineStartValue,
        startPointX: activeDrag.fineStartPointX,
        startPointY: activeDrag.fineStartPointY,
        pointX: event.clientX,
        pointY: event.clientY,
      };

      return {
        value: getSliderValueFromLinearDrag(
          drag,
          context.state.value,
          activeDrag.activeThumb,
          context.state,
          {
            fine,
            fineFactor: context.getFineFactor(),
          },
        ),
        fine,
        fineStartValue: activeDrag.fineStartValue,
        fineStartPointX: activeDrag.fineStartPointX,
        fineStartPointY: activeDrag.fineStartPointY,
      };
    },
    [context.getFineFactor, context.state, getValueFromPointer],
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
    const activeThumb =
      getThumbIndexFromTarget(event) ??
      getClosestSliderThumbIndexFromPoint(getPoint(event), context.state.value, context.state);
    const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
    const shouldUpdateFromPointer = allowTrackClick;
    const nextValue = shouldUpdateFromPointer
      ? getValueFromPointer(event, activeThumb)
      : context.state.value;
    const currentThumbValue = nextValue[activeThumb];
    activeDragRef.current = {
      pointerId: event.pointerId,
      activeThumb,
      currentValue: nextValue,
      startPointX: event.clientX,
      startPointY: event.clientY,
      fine,
      fineStartValue: fine ? currentThumbValue : undefined,
      fineStartPointX: fine ? event.clientX : undefined,
      fineStartPointY: fine ? event.clientY : undefined,
    };
    context.setActiveThumb(activeThumb);

    if (shouldUpdateFromPointer) {
      context.setValue(nextValue, { activeThumb, fine });
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
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
    context.setValue(dragValue.value, {
      activeThumb: activeDrag.activeThumb,
      fine: dragValue.fine,
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const activeDrag = activeDragRef.current;
    if (activeDrag === null || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    const dragValue = activeDrag.currentValue;
    releasePointerCapture(event);
    context.setActiveThumb(null);
    context.setDragging(false);
    activeDragRef.current = null;
    context.commitValue(dragValue, {
      activeThumb: activeDrag.activeThumb,
      fine: activeDrag.fine,
    });
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const activeDrag = activeDragRef.current;

    if (activeDrag === null || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    releasePointerCapture(event);
    context.setActiveThumb(null);
    context.setDragging(false);
    activeDragRef.current = null;
  };

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    onDoubleClick?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.resetOnDoubleClick) {
      return;
    }

    event.preventDefault();
    context.resetValue();
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const trackProps = mergeProps(elementProps, {
    ref: composedRef,
    "data-part": "track",
    "data-thumb-count": context.state.thumbs.length,
    "data-orientation": context.state.orientation,
    "data-origin": context.state.origin,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": context.dragging ? "" : undefined,
    style: getSliderStyle(style, context.state),
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onDoubleClick: handleDoubleClick,
  });

  return renderElement("div", render, trackProps, renderState);
});

function isThumbPointerTarget(event: PointerEvent<HTMLDivElement>) {
  if (typeof Element === "undefined" || !(event.target instanceof Element)) {
    return false;
  }

  const thumb = event.target.closest('[data-part="thumb"]');
  return thumb !== null && event.currentTarget.contains(thumb);
}

function getThumbIndexFromTarget(event: PointerEvent<HTMLDivElement>) {
  if (typeof Element === "undefined" || !(event.target instanceof Element)) {
    return undefined;
  }

  const thumb = event.target.closest("[data-thumb-index]");

  if (thumb === null || !event.currentTarget.contains(thumb)) {
    return undefined;
  }

  return thumb.getAttribute("data-thumb-index") === "1" ? 1 : 0;
}
