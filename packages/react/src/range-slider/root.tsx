import {
  createRangeSliderState,
  getFineStep,
  type RangeSliderState,
  type RangeSliderThumbIndex,
  type RangeSliderValue,
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
  RangeSliderContext,
  type RangeSliderContextValue,
  type RangeSliderValueOptions,
} from "./context.tsx";
import type { RangeSliderRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, RangeSliderRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    minDistance,
    orientation,
    inverted,
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
    style,
    ...elementProps
  } = props;
  const isControlled = value !== undefined;
  const initialValue: RangeSliderValue = defaultValue ?? [min ?? 0, max ?? 100];
  const resetValueTarget: RangeSliderValue = defaultValue ?? [min ?? 0, max ?? 100];
  const [internalValue, setInternalValue] = useState<RangeSliderValue>(initialValue);
  const [valueStep, setValueStep] = useState<number | undefined>(undefined);
  const [activeThumb, setActiveThumb] = useState<RangeSliderThumbIndex | null>(null);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createRangeSliderState(rawValue, {
        min,
        max,
        step,
        minStepsBetweenThumbs,
        minDistance,
        orientation,
        inverted,
        valueStep,
      }),
    [
      rawValue,
      min,
      max,
      step,
      minStepsBetweenThumbs,
      minDistance,
      orientation,
      inverted,
      valueStep,
    ],
  );
  const valueId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = activeThumb !== null;

  const getStateForValue = useCallback(
    (nextValue: RangeSliderValue, options: RangeSliderValueOptions = {}): RangeSliderState => {
      const nextValueStep = fineControl && options.fine ? getFineStep(state.step) : undefined;
      return createRangeSliderState(nextValue, {
        min,
        max,
        step,
        minStepsBetweenThumbs,
        minDistance,
        orientation,
        inverted,
        valueStep: nextValueStep,
      });
    },
    [
      fineControl,
      inverted,
      max,
      min,
      minDistance,
      minStepsBetweenThumbs,
      orientation,
      state.step,
      step,
    ],
  );

  const setValue = useCallback(
    (nextValue: RangeSliderValue, options: RangeSliderValueOptions = {}) => {
      const nextValueStep = fineControl && options.fine ? getFineStep(state.step) : undefined;
      const nextState = createRangeSliderState(nextValue, {
        min,
        max,
        step,
        minStepsBetweenThumbs,
        minDistance,
        orientation,
        inverted,
        valueStep: nextValueStep,
        activeThumb: options.activeThumb,
      });
      setValueStep(nextValueStep);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value[0] !== state.value[0] || nextState.value[1] !== state.value[1]) {
        onValueChange?.(nextState.value);
      }
    },
    [
      fineControl,
      inverted,
      isControlled,
      max,
      min,
      minDistance,
      minStepsBetweenThumbs,
      onValueChange,
      orientation,
      state.step,
      state.value,
      step,
    ],
  );

  const commitValue = useCallback(
    (nextValue: RangeSliderValue, options: RangeSliderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const resetValue = useCallback(() => {
    setValue(resetValueTarget);
    commitValue(resetValueTarget);
  }, [commitValue, resetValueTarget, setValue]);

  const contextValue = useMemo<RangeSliderContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      fineControl,
      resetOnDoubleClick,
      dragging,
      activeThumb,
      valueId,
      name,
      required,
      trackRef,
      setActiveThumb,
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
      activeThumb,
      valueId,
      name,
      required,
      trackRef,
      setValue,
      commitValue,
      resetValue,
    ],
  );
  const renderState = getRenderState(state, { disabled, readOnly, dragging });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    "data-audio-ui": "range-slider",
    "data-part": "root",
    "data-orientation": state.orientation,
    "data-inverted": state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": dragging ? "" : undefined,
    style: getRangeSliderStyle(style, state),
  });

  return (
    <RangeSliderContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </RangeSliderContext.Provider>
  );
});

export function getRangeSliderStyle(style: CSSProperties | undefined, state: RangeSliderState) {
  return {
    ...style,
    "--range-slider-start-percent": state.startPercent,
    "--range-slider-end-percent": state.endPercent,
    "--range-slider-size-percent": state.sizePercent,
  } as CSSProperties;
}
