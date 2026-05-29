import { getFaderValueFromPoint } from "@audio-ui/core";
import { forwardRef, useCallback, useRef, type CSSProperties, type PointerEvent } from "react";
import { useComposedRefs } from "../shared/refs.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useFaderContext } from "./context.tsx";
import type { FaderTrackProps } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  currentValue: number;
}

export const Track = forwardRef<HTMLDivElement, FaderTrackProps>(function Track(props, ref) {
  const {
    render,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    style,
    ...elementProps
  } = props;
  const context = useFaderContext("Fader.Track");
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, context.trackRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;
  const allowTrackClick = context.allowTrackClick;

  const getValueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();

      return getFaderValueFromPoint(
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
    const nextValue = allowTrackClick ? getValueFromPointer(event) : context.state.value;
    activeDragRef.current = {
      pointerId: event.pointerId,
      currentValue: nextValue,
    };
    context.setDragging(true);

    if (allowTrackClick) {
      context.setValue(nextValue);
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

    const nextValue = getValueFromPointer(event);
    activeDragRef.current = {
      ...activeDrag,
      currentValue: nextValue,
    };
    context.setValue(nextValue);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    const dragValue = activeDragRef.current?.currentValue ?? context.state.value;
    releasePointerCapture(event);
    context.setDragging(false);
    activeDragRef.current = null;
    context.commitValue(dragValue);
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
    "data-orientation": "vertical",
    "data-inverted": context.state.inverted ? "" : undefined,
    "data-unity": context.state.value === context.state.unity ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--fader-value": context.state.value,
      "--fader-percent": context.state.percent,
      "--fader-unity-percent": context.state.unityPercent,
      "--fader-gain": context.state.gain,
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
