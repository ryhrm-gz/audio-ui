import {
  createEQCurveState,
  eqCurveValuesEqual,
  type EQCurveState,
  type EQCurveValue,
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
import { isFineControlEnabled, resolveFineAxisValueStep } from "../shared/fine-control.ts";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import {
  EQCurveContext,
  type EQCurveContextValue,
  type EQCurveValueChangeOptions,
} from "./context.tsx";
import type { EQCurveRootProps } from "./types.ts";

const defaultValue: EQCurveValue = [];

export const Root = forwardRef<HTMLDivElement, EQCurveRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue: defaultValueProp = defaultValue,
    minFrequency,
    maxFrequency,
    minGain,
    maxGain,
    minQ,
    maxQ,
    stepFrequency,
    stepGain,
    stepQ,
    curveResolution,
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
  const [internalValue, setInternalValue] = useState(defaultValueProp);
  const [valueStep, setValueStep] = useState<{ frequency?: number; gain?: number; q?: number }>({});
  const [draggingBand, setDraggingBand] = useState<string | null>(null);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createEQCurveState(rawValue, {
        minFrequency,
        maxFrequency,
        minGain,
        maxGain,
        minQ,
        maxQ,
        stepFrequency,
        stepGain,
        stepQ,
        curveResolution,
        valueStepFrequency: valueStep.frequency,
        valueStepGain: valueStep.gain,
        valueStepQ: valueStep.q,
        activeBand: draggingBand,
      }),
    [
      rawValue,
      minFrequency,
      maxFrequency,
      minGain,
      maxGain,
      minQ,
      maxQ,
      stepFrequency,
      stepGain,
      stepQ,
      curveResolution,
      valueStep,
      draggingBand,
    ],
  );
  const valueId = useId();
  const graphRef = useRef<HTMLDivElement | null>(null);
  const getFineValueStep = useCallback(
    (step: number, axis: "frequency" | "gain" | "q") =>
      resolveFineAxisValueStep(step, axis, fineControl),
    [fineControl],
  );

  const getStateForValue = useCallback(
    (nextValue: EQCurveValue, options: EQCurveValueChangeOptions = {}): EQCurveState => {
      const nextValueStep = {
        frequency:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepFrequency, "frequency")
            : undefined,
        gain:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepGain, "gain")
            : undefined,
        q:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepQ, "q")
            : undefined,
      };

      return createEQCurveState(nextValue, {
        minFrequency,
        maxFrequency,
        minGain,
        maxGain,
        minQ,
        maxQ,
        stepFrequency,
        stepGain,
        stepQ,
        curveResolution,
        valueStepFrequency: nextValueStep.frequency,
        valueStepGain: nextValueStep.gain,
        valueStepQ: nextValueStep.q,
        activeBand: options.activeBand ?? draggingBand,
      });
    },
    [
      curveResolution,
      draggingBand,
      fineControl,
      getFineValueStep,
      maxFrequency,
      maxGain,
      maxQ,
      minFrequency,
      minGain,
      minQ,
      state.stepFrequency,
      state.stepGain,
      state.stepQ,
      stepFrequency,
      stepGain,
      stepQ,
    ],
  );

  const setValue = useCallback(
    (nextValue: EQCurveValue, options: EQCurveValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      const nextValueStep = {
        frequency:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepFrequency, "frequency")
            : undefined,
        gain:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepGain, "gain")
            : undefined,
        q:
          isFineControlEnabled(fineControl) && options.fine
            ? getFineValueStep(state.stepQ, "q")
            : undefined,
      };
      setValueStep(nextValueStep);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!eqCurveValuesEqual(nextState.value, state.value)) {
        onValueChange?.(nextState.value);
      }
    },
    [
      fineControl,
      getFineValueStep,
      getStateForValue,
      isControlled,
      onValueChange,
      state.stepFrequency,
      state.stepGain,
      state.stepQ,
      state.value,
    ],
  );

  const commitValue = useCallback(
    (nextValue: EQCurveValue, options: EQCurveValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const contextValue = useMemo<EQCurveContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
      getFineValueStep,
      draggingBand,
      valueId,
      name,
      required,
      graphRef,
      setDraggingBand,
      setValue,
      commitValue,
    }),
    [
      state,
      disabled,
      readOnly,
      fineControl,
      getFineValueStep,
      draggingBand,
      valueId,
      name,
      required,
      graphRef,
      setDraggingBand,
      setValue,
      commitValue,
    ],
  );
  const renderState = getRenderState(state, {
    disabled,
    readOnly,
    dragging: draggingBand !== null,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "eq-curve",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": draggingBand !== null ? "" : undefined,
    style: {
      ...style,
      "--eq-curve-band-count": state.bands.length,
      "--eq-curve-min-frequency": state.minFrequency,
      "--eq-curve-max-frequency": state.maxFrequency,
      "--eq-curve-min-gain": state.minGain,
      "--eq-curve-max-gain": state.maxGain,
    } as CSSProperties,
  });

  return (
    <EQCurveContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </EQCurveContext.Provider>
  );
});
