import { createSliderState, getFineStep, type SliderState } from "@ryhrm-gz/audio-ui-core";
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
    origin,
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
    style,
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
    () => createSliderState(rawValue, { min, max, step, orientation, inverted, origin, valueStep }),
    [rawValue, min, max, step, orientation, inverted, origin, valueStep],
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
        origin,
        valueStep: nextValueStep,
      });
    },
    [fineControl, inverted, max, min, origin, orientation, state.step, step],
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

  const resetValue = useCallback(() => {
    setValue(resetValueTarget);
    commitValue(resetValueTarget);
  }, [commitValue, resetValueTarget, setValue]);

  const contextValue = useMemo<SliderContextValue>(
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
    "data-audio-ui": "slider",
    "data-orientation": state.orientation,
    "data-origin": state.origin,
    "data-inverted": state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": dragging ? "" : undefined,
    style: {
      ...style,
      "--slider-value": state.value,
      "--slider-percent": state.percent,
      "--slider-origin-percent": state.originPercent,
      "--slider-range-start-percent": state.rangeStartPercent,
      "--slider-range-end-percent": state.rangeEndPercent,
      "--slider-range-size-percent": state.rangeSizePercent,
    } as CSSProperties,
  });

  return (
    <SliderContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </SliderContext.Provider>
  );
});
