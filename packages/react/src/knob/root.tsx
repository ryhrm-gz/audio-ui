import { createKnobState, getFineStep, type KnobState } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import { KnobContext, type KnobContextValue, type KnobValueOptions } from "./context.tsx";
import { getRenderState, mergeProps, renderElement } from "./render.tsx";
import type { KnobRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, KnobRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    min,
    max,
    step,
    minAngle,
    maxAngle,
    disabled = false,
    readOnly = false,
    fineControl = true,
    resetOnDoubleClick = true,
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
    () => createKnobState(rawValue, { min, max, step, minAngle, maxAngle, valueStep }),
    [rawValue, min, max, step, minAngle, maxAngle, valueStep],
  );
  const valueId = useId();

  const getStateForValue = useCallback(
    (nextValue: number, options: KnobValueOptions = {}): KnobState => {
      const nextValueStep = fineControl && options.fine ? getFineStep(state.step) : undefined;
      return createKnobState(nextValue, {
        min,
        max,
        step,
        minAngle,
        maxAngle,
        valueStep: nextValueStep,
      });
    },
    [fineControl, max, maxAngle, min, minAngle, state.step, step],
  );

  const setValue = useCallback(
    (nextValue: number, options: KnobValueOptions = {}) => {
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
    (nextValue: number, options: KnobValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const resetValue = useCallback(() => {
    setValue(resetValueTarget);
    commitValue(resetValueTarget);
  }, [commitValue, resetValueTarget, setValue]);

  const contextValue = useMemo<KnobContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
      resetOnDoubleClick,
      dragging,
      valueId,
      name,
      required,
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
      dragging,
      valueId,
      name,
      required,
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
    "data-audio-ui": "knob",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": dragging ? "" : undefined,
  });

  return (
    <KnobContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </KnobContext.Provider>
  );
});
