import {
  createSliderState,
  type SliderState,
  type SliderThumbIndex,
  type SliderValue,
} from "@ryhrm-gz/audio-ui-core";
import { resolveFineFactor } from "../shared/fine-control.ts";
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
    minStepsBetweenThumbs,
    minDistance,
    thumbs,
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
  const initialValue: SliderValue = defaultValue ?? [min ?? 0];
  const resetValueTarget: SliderValue = defaultValue ?? [min ?? 0];
  const [internalValue, setInternalValue] = useState<SliderValue>(initialValue);
  const [draggingState, setDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<SliderThumbIndex | null>(null);
  const rawValue = value ?? internalValue;
  const state = useMemo(
    () =>
      createSliderState(rawValue, {
        min,
        max,
        step,
        minStepsBetweenThumbs,
        minDistance,
        thumbs,
        orientation,
        inverted,
        origin,
      }),
    [
      rawValue,
      min,
      max,
      step,
      minStepsBetweenThumbs,
      minDistance,
      thumbs,
      orientation,
      inverted,
      origin,
    ],
  );
  const valueId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = draggingState || activeThumb !== null;
  const getFineFactor = useCallback(() => resolveFineFactor(fineControl), [fineControl]);

  const getStateForValue = useCallback(
    (nextValue: SliderValue, options: SliderValueOptions = {}): SliderState => {
      return createSliderState(nextValue, {
        min,
        max,
        step,
        minStepsBetweenThumbs,
        minDistance,
        thumbs,
        orientation,
        inverted,
        origin,
        activeThumb: options.activeThumb,
      });
    },
    [inverted, max, min, minDistance, minStepsBetweenThumbs, origin, orientation, step, thumbs],
  );

  const setValue = useCallback(
    (nextValue: SliderValue, options: SliderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!isEqualValue(nextState.value, state.value)) {
        (onValueChange as ((value: SliderValue) => void) | undefined)?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value],
  );

  const commitValue = useCallback(
    (nextValue: SliderValue, options: SliderValueOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      (onValueCommit as ((value: SliderValue) => void) | undefined)?.(nextState.value);
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
      getFineFactor,
      resetOnDoubleClick,
      allowTrackClick,
      dragging,
      activeThumb,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
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
      getFineFactor,
      resetOnDoubleClick,
      allowTrackClick,
      dragging,
      activeThumb,
      valueId,
      name,
      required,
      trackRef,
      setDragging,
      setActiveThumb,
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
    "data-part": "root",
    "data-thumb-count": state.thumbs.length,
    "data-orientation": state.orientation,
    "data-origin": state.origin,
    "data-inverted": state.inverted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": dragging ? "" : undefined,
    style: getSliderStyle(style, state),
  });

  return (
    <SliderContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </SliderContext.Provider>
  );
});

export function getSliderStyle(style: CSSProperties | undefined, state: SliderState) {
  return {
    ...style,
    "--slider-value": state.value.join(","),
    "--slider-percent": state.percent.join(","),
    "--slider-origin-percent": state.originPercent,
    "--slider-range-start-percent": state.rangeStartPercent,
    "--slider-range-end-percent": state.rangeEndPercent,
    "--slider-range-size-percent": state.rangeSizePercent,
  } as CSSProperties;
}

function isEqualValue(left: SliderValue, right: SliderValue) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
