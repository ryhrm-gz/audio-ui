import { createSliderState, type SliderState } from "@audio-ui/core";
import { forwardRef, useCallback, useId, useMemo, useRef, useState } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { SliderContext, type SliderContextValue } from "./context.tsx";
import type { SliderRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, SliderRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    min,
    max,
    step,
    orientation,
    inverted,
    disabled = false,
    readOnly = false,
    allowTrackClick = false,
    name,
    required,
    children,
    onValueChange,
    onValueCommit,
    render,
    ...elementProps
  } = props;
  const isControlled = value !== undefined;
  const initialValue = defaultValue ?? min ?? 0;
  const [internalValue, setInternalValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () => createSliderState(rawValue, { min, max, step, orientation, inverted }),
    [rawValue, min, max, step, orientation, inverted],
  );
  const valueId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const getStateForValue = useCallback(
    (nextValue: number): SliderState =>
      createSliderState(nextValue, { min, max, step, orientation, inverted }),
    [inverted, max, min, orientation, step],
  );

  const setValue = useCallback(
    (nextValue: number) => {
      const nextState = getStateForValue(nextValue);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value !== state.value) {
        onValueChange?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value],
  );

  const commitValue = useCallback(
    (nextValue: number) => {
      const nextState = getStateForValue(nextValue);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const contextValue = useMemo<SliderContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      allowTrackClick,
      dragging,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
      setValue,
      commitValue,
    }),
    [
      state,
      disabled,
      readOnly,
      allowTrackClick,
      dragging,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
      setValue,
      commitValue,
    ],
  );
  const renderState = getRenderState(state, { disabled, readOnly, dragging });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "slider",
    "data-orientation": state.orientation,
    "data-inverted": state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": dragging ? "" : undefined,
  });

  return (
    <SliderContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </SliderContext.Provider>
  );
});
