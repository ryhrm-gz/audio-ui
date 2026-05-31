import {
  getClosestRangeSliderThumbIndexFromPoint,
  getRangeSliderValueFromPoint,
  type RangeSliderThumbIndex,
  type RangeSliderValue,
} from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useRef, type MouseEvent, type PointerEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useComposedRefs } from "../shared/refs.ts";
import { useRangeSliderContext } from "./context.tsx";
import { getRangeSliderStyle } from "./root.tsx";
import type { RangeSliderTrackProps } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  activeThumb: RangeSliderThumbIndex;
  currentValue: RangeSliderValue;
  fine: boolean;
}

export const Track = forwardRef<HTMLDivElement, RangeSliderTrackProps>(function Track(props, ref) {
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
  const context = useRangeSliderContext("RangeSlider.Track");
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, context.trackRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;

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
    (event: PointerEvent<HTMLDivElement>, activeThumb: RangeSliderThumbIndex) =>
      getRangeSliderValueFromPoint(
        getPoint(event),
        context.state.value,
        activeThumb,
        context.state,
      ),
    [context.state],
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

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const activeThumb =
      getThumbIndexFromTarget(event) ??
      getClosestRangeSliderThumbIndexFromPoint(getPoint(event), context.state.value, context.state);
    const fine = context.fineControl && event.shiftKey;
    const nextValue = getValueFromPointer(event, activeThumb);
    activeDragRef.current = {
      pointerId: event.pointerId,
      activeThumb,
      currentValue: nextValue,
      fine,
    };
    context.setActiveThumb(activeThumb);
    context.setValue(nextValue, { activeThumb, fine });
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

    const fine = context.fineControl && event.shiftKey;
    const nextValue = getValueFromPointer(event, activeDrag.activeThumb);
    activeDragRef.current = {
      ...activeDrag,
      currentValue: nextValue,
      fine,
    };
    context.setValue(nextValue, { activeThumb: activeDrag.activeThumb, fine });
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

    releasePointerCapture(event);
    context.setActiveThumb(null);
    activeDragRef.current = null;
    context.commitValue(activeDrag.currentValue, {
      activeThumb: activeDrag.activeThumb,
      fine: activeDrag.fine,
    });
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    releasePointerCapture(event);
    context.setActiveThumb(null);
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
    "data-orientation": context.state.orientation,
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: getRangeSliderStyle(style, context.state),
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onDoubleClick: handleDoubleClick,
  });

  return renderElement("div", render, trackProps, renderState);
});

function getThumbIndexFromTarget(event: PointerEvent<HTMLDivElement>) {
  if (!(event.target instanceof Element)) {
    return undefined;
  }

  const thumb = event.target.closest("[data-thumb-index]");

  if (thumb === null || !event.currentTarget.contains(thumb)) {
    return undefined;
  }

  return thumb.getAttribute("data-thumb-index") === "1" ? 1 : 0;
}
