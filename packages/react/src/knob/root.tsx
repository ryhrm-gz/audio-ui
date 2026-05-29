import { createKnobState, type KnobState } from "@audio-ui/core";
import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import { KnobContext, type KnobContextValue } from "./context.tsx";
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
    () => createKnobState(rawValue, { min, max, step, minAngle, maxAngle }),
    [rawValue, min, max, step, minAngle, maxAngle],
  );
  const valueId = useId();

  const getStateForValue = useCallback(
    (nextValue: number): KnobState =>
      createKnobState(nextValue, { min, max, step, minAngle, maxAngle }),
    [max, maxAngle, min, minAngle, step],
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

  const contextValue = useMemo<KnobContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      dragging,
      valueId,
      name,
      required,
      setDragging,
      setValue,
      commitValue,
    }),
    [
      state,
      disabled,
      readOnly,
      dragging,
      valueId,
      name,
      required,
      setDragging,
      setValue,
      commitValue,
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
