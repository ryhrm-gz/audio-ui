import { createSliderState, getFineStep, type SliderState } from "@audio-ui/core";
import { forwardRef, useCallback, useId, useMemo, useRef, useState } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { SliderContext, type SliderContextValue, type SliderValueOptions } from "./context.tsx";
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
    fineControl = true,
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
  const [valueStep, setValueStep] = useState<number | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () => createSliderState(rawValue, { min, max, step, orientation, inverted, valueStep }),
    [rawValue, min, max, step, orientation, inverted, valueStep],
  );
  const valueId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const getStateForValue = useCallback(
    (nextValue: number, options: SliderValueOptions = {}): SliderState => {
      const nextValueStep = fineControl && options.fine ? getFineStep(state.step) : undefined;
      return createSliderState(nextValue, {
        min,
        max,
        step,
        orientation,
        inverted,
        valueStep: nextValueStep,
      });
    },
    [fineControl, inverted, max, min, orientation, state.step, step],
  );

  const setValue = useCallback(
    (nextValue: number, options: SliderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      setValueStep(fineControl && options.fine ? getFineStep(state.step) : undefined);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value !== state.value) {
        onValueChange?.(nextState.value);
      }
    },
    [fineControl, getStateForValue, isControlled, onValueChange, state.step, state.value],
  );

  const commitValue = useCallback(
    (nextValue: number, options: SliderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const contextValue = useMemo<SliderContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
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
      fineControl,
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
