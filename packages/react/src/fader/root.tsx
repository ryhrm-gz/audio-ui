import { createFaderState, getFineStep, type FaderState } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useId, useMemo, useRef, useState } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { FaderContext, type FaderContextValue, type FaderValueOptions } from "./context.tsx";
import type { FaderRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, FaderRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    min,
    max,
    step,
    orientation,
    inverted,
    unity,
    scale,
    disabled = false,
    readOnly = false,
    fineControl = true,
    resetOnDoubleClick = true,
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
  const resetValueTarget = defaultValue ?? min ?? 0;
  const [internalValue, setInternalValue] = useState(initialValue);
  const [valueStep, setValueStep] = useState<number | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createFaderState(rawValue, {
        min,
        max,
        step,
        orientation,
        inverted,
        unity,
        scale,
        valueStep,
      }),
    [rawValue, min, max, step, orientation, inverted, unity, scale, valueStep],
  );
  const valueId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const getStateForValue = useCallback(
    (nextValue: number, options: FaderValueOptions = {}): FaderState => {
      const nextValueStep = fineControl && options.fine ? getFineStep(state.step) : undefined;
      return createFaderState(nextValue, {
        min,
        max,
        step,
        orientation,
        inverted,
        unity,
        scale,
        valueStep: nextValueStep,
      });
    },
    [fineControl, inverted, max, min, orientation, scale, state.step, step, unity],
  );

  const setValue = useCallback(
    (nextValue: number, options: FaderValueOptions = {}) => {
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
    (nextValue: number, options: FaderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const resetValue = useCallback(() => {
    setValue(resetValueTarget);
    commitValue(resetValueTarget);
  }, [commitValue, resetValueTarget, setValue]);

  const contextValue = useMemo<FaderContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
      resetOnDoubleClick,
      allowTrackClick,
      dragging,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
      setValue,
      commitValue,
      resetValue,
    }),
    [
      state,
      disabled,
      readOnly,
      fineControl,
      resetOnDoubleClick,
      allowTrackClick,
      dragging,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
      setValue,
      commitValue,
      resetValue,
    ],
  );
  const renderState = getRenderState(state, { disabled, readOnly, dragging });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "fader",
    "data-orientation": state.orientation,
    "data-inverted": state.inverted ? "" : undefined,
    "data-unity": state.value === state.unity ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": dragging ? "" : undefined,
  });

  return (
    <FaderContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </FaderContext.Provider>
  );
});
