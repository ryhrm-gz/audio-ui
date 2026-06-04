import { getKnobValueFromLinearDrag, getNextKeyboardValue } from "@ryhrm-gz/audio-ui-core";
import { isFineControlEnabled } from "../shared/fine-control.ts";
import {
  forwardRef,
  useCallback,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useKnobContext } from "./context.tsx";
import { useComposedRefs } from "./refs.ts";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobControlProps } from "./types.ts";

interface ActiveDrag {
  pointerId: number;
  startValue: number;
  currentValue: number;
  startY: number;
  trackSize: number;
  fine: boolean;
  fineStartValue?: number;
  fineStartY?: number;
}

export const Control = forwardRef<HTMLDivElement, KnobControlProps>(function Control(props, ref) {
  const {
    render,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onDoubleClick,
    onKeyDown,
    style,
    ...elementProps
  } = props;
  const context = useKnobContext("Knob.Control");
  const controlRef = useRef<HTMLDivElement | null>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, controlRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  const updateValueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const activeDrag = activeDragRef.current;

      if (activeDrag === null || activeDrag.pointerId !== event.pointerId) {
        return;
      }

      const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
      const startValue = fine ? activeDrag.fineStartValue : activeDrag.startValue;
      const startY = fine ? activeDrag.fineStartY : activeDrag.startY;

      if (fine && (startValue === undefined || startY === undefined)) {
        activeDragRef.current = {
          ...activeDrag,
          fine,
          fineStartValue: activeDrag.currentValue,
          fineStartY: event.clientY,
        };
        return;
      }

      const nextValue = getKnobValueFromLinearDrag(
        {
          startValue: startValue ?? activeDrag.startValue,
          startY: startY ?? activeDrag.startY,
          pointY: event.clientY,
          trackSize: activeDrag.trackSize,
        },
        context.state,
        {
          fine,
          fineStep: fine ? context.getFineValueStep(context.state.step) : undefined,
        },
      );

      activeDragRef.current = {
        ...activeDrag,
        currentValue: nextValue,
        fine,
        fineStartValue: fine ? startValue : undefined,
        fineStartY: fine ? startY : undefined,
      };
      context.setValue(nextValue, { fine });
    },
    [context],
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
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
    activeDragRef.current = {
      pointerId: event.pointerId,
      startValue: context.state.value,
      currentValue: context.state.value,
      startY: event.clientY,
      trackSize: Math.max(rect.width, rect.height),
      fine,
      fineStartValue: fine ? context.state.value : undefined,
      fineStartY: fine ? event.clientY : undefined,
    };
    context.setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    updateValueFromPointer(event);
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

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    onDoubleClick?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.resetOnDoubleClick) {
      return;
    }

    event.preventDefault();
    context.resetValue();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const fine = isFineControlEnabled(context.fineControl) && event.shiftKey;
    const nextValue = getNextKeyboardValue(context.state.value, event.key, context.state, {
      fine,
      fineStep: fine ? context.getFineValueStep(context.state.step) : undefined,
    });

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setValue(nextValue, { fine });
    context.commitValue(nextValue, { fine });
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const controlProps = mergeProps(elementProps, {
    ref: composedRef,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-readonly": readOnly || undefined,
    "aria-valuemin": context.state.min,
    "aria-valuemax": context.state.max,
    "aria-valuenow": context.state.value,
    "aria-valuetext": String(context.state.value),
    "aria-describedby": context.valueId,
    "data-part": "control",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--knob-value": context.state.value,
      "--knob-percent": context.state.percent,
      "--knob-angle": `${context.state.angle}deg`,
    } as CSSProperties,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onDoubleClick: handleDoubleClick,
    onKeyDown: handleKeyDown,
  });

  return renderElement("div", render, controlProps, renderState);
});
