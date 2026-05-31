import {
  createEnvelopeEditorState,
  defaultEnvelopeEditorValue,
  envelopeEditorValuesEqual,
  getFineStep,
  type EnvelopeEditorPointId,
  type EnvelopeEditorState,
  type EnvelopeEditorValue,
} from "@ryhrm-gz/audio-ui-core";
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import {
  EnvelopeEditorContext,
  type EnvelopeEditorContextValue,
  type EnvelopeEditorValueChangeOptions,
} from "./context.tsx";
import type { EnvelopeEditorRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, EnvelopeEditorRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue = defaultEnvelopeEditorValue,
    minTime,
    maxTime,
    minLevel,
    maxLevel,
    stepTime,
    stepLevel,
    mode,
    disabled = false,
    readOnly = false,
    fineControl = true,
    name,
    required,
    children,
    onValueChange,
    onValueCommit,
    render,
    style,
    ...elementProps
  } = props;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [valueStep, setValueStep] = useState<{ time?: number; level?: number }>({});
  const [draggingPoint, setDraggingPoint] = useState<EnvelopeEditorPointId | null>(null);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createEnvelopeEditorState(rawValue, {
        minTime,
        maxTime,
        minLevel,
        maxLevel,
        stepTime,
        stepLevel,
        mode,
        disabled,
        readOnly,
        valueStepTime: valueStep.time,
        valueStepLevel: valueStep.level,
        activePoint: draggingPoint,
      }),
    [
      rawValue,
      minTime,
      maxTime,
      minLevel,
      maxLevel,
      stepTime,
      stepLevel,
      mode,
      disabled,
      readOnly,
      valueStep,
      draggingPoint,
    ],
  );
  const valueId = useId();
  const graphRef = useRef<HTMLDivElement | null>(null);

  const getStateForValue = useCallback(
    (
      nextValue: EnvelopeEditorValue,
      options: EnvelopeEditorValueChangeOptions = {},
    ): EnvelopeEditorState => {
      const nextValueStep = {
        time: fineControl && options.fine ? getFineStep(state.stepTime) : undefined,
        level: fineControl && options.fine ? getFineStep(state.stepLevel) : undefined,
      };

      return createEnvelopeEditorState(nextValue, {
        minTime,
        maxTime,
        minLevel,
        maxLevel,
        stepTime,
        stepLevel,
        mode,
        disabled,
        readOnly,
        valueStepTime: nextValueStep.time,
        valueStepLevel: nextValueStep.level,
        activePoint: options.activePoint ?? draggingPoint,
      });
    },
    [
      disabled,
      draggingPoint,
      fineControl,
      maxLevel,
      maxTime,
      minLevel,
      minTime,
      mode,
      readOnly,
      state.stepLevel,
      state.stepTime,
      stepLevel,
      stepTime,
    ],
  );

  const setValue = useCallback(
    (nextValue: EnvelopeEditorValue, options: EnvelopeEditorValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      const nextValueStep = {
        time: fineControl && options.fine ? getFineStep(state.stepTime) : undefined,
        level: fineControl && options.fine ? getFineStep(state.stepLevel) : undefined,
      };
      setValueStep(nextValueStep);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!envelopeEditorValuesEqual(nextState.value, state.value)) {
        onValueChange?.(nextState.value);
      }
    },
    [
      fineControl,
      getStateForValue,
      isControlled,
      onValueChange,
      state.stepLevel,
      state.stepTime,
      state.value,
    ],
  );

  const commitValue = useCallback(
    (nextValue: EnvelopeEditorValue, options: EnvelopeEditorValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const contextValue = useMemo<EnvelopeEditorContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
      draggingPoint,
      valueId,
      name,
      required,
      graphRef,
      setDraggingPoint,
      setValue,
      commitValue,
    }),
    [
      state,
      disabled,
      readOnly,
      fineControl,
      draggingPoint,
      valueId,
      name,
      required,
      graphRef,
      setDraggingPoint,
      setValue,
      commitValue,
    ],
  );
  const renderState = getRenderState(state, {
    disabled,
    readOnly,
    dragging: draggingPoint !== null,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "envelope-editor",
    "data-mode": state.mode,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": draggingPoint !== null ? "" : undefined,
    style: {
      ...style,
      "--envelope-attack": state.value.attack,
      "--envelope-decay": state.value.decay,
      "--envelope-sustain": state.value.sustain,
      "--envelope-release": state.value.release,
      "--envelope-total-duration": state.totalDuration,
    } as CSSProperties,
  });

  return (
    <EnvelopeEditorContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </EnvelopeEditorContext.Provider>
  );
});
