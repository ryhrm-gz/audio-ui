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
import { resolveFineAxisFactor } from "../shared/fine-control.ts";
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
      draggingBand,
    ],
  );
  const valueId = useId();
  const graphRef = useRef<HTMLDivElement | null>(null);
  const getFineFactor = useCallback(
    (axis: "frequency" | "gain") => resolveFineAxisFactor(axis, fineControl),
    [fineControl],
  );

  const getStateForValue = useCallback(
    (nextValue: EQCurveValue, options: EQCurveValueChangeOptions = {}): EQCurveState => {
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
        activeBand: options.activeBand ?? draggingBand,
      });
    },
    [
      curveResolution,
      draggingBand,
      maxFrequency,
      maxGain,
      maxQ,
      minFrequency,
      minGain,
      minQ,
      stepFrequency,
      stepGain,
      stepQ,
    ],
  );

  const setValue = useCallback(
    (nextValue: EQCurveValue, options: EQCurveValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!eqCurveValuesEqual(nextState.value, state.value)) {
        onValueChange?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value],
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
      getFineFactor,
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
      getFineFactor,
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
