import { createXYPadState, getFineStep, type XYPadState } from "@ryhrm-gz/audio-ui-core";
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
import { XYPadContext, type XYPadContextValue, type XYPadValueChangeOptions } from "./context.tsx";
import type { XYPadRootProps } from "./types.ts";

const defaultValueStep = {};

export const Root = forwardRef<HTMLDivElement, XYPadRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue: defaultValueProp,
    minX,
    maxX,
    stepX,
    minY,
    maxY,
    stepY,
    disabled = false,
    readOnly = false,
    fineControl = true,
    resetOnDoubleClick = true,
    allowTrackClick = true,
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
  const initialValue = defaultValueProp ?? { x: minX ?? 0, y: minY ?? 0 };
  const resetValueTarget = defaultValueProp ?? { x: minX ?? 0, y: minY ?? 0 };
  const [internalValue, setInternalValue] = useState(initialValue);
  const [valueStep, setValueStep] = useState<{ x?: number; y?: number }>(defaultValueStep);
  const [dragging, setDragging] = useState(false);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createXYPadState(rawValue, {
        minX,
        maxX,
        stepX,
        minY,
        maxY,
        stepY,
        valueStepX: valueStep.x,
        valueStepY: valueStep.y,
      }),
    [rawValue, minX, maxX, stepX, minY, maxY, stepY, valueStep],
  );
  const valueId = useId();
  const areaRef = useRef<HTMLDivElement | null>(null);

  const getStateForValue = useCallback(
    (nextValue: { x: number; y: number }, options: XYPadValueChangeOptions = {}): XYPadState => {
      const nextValueStep = {
        x: fineControl && options.fine ? getFineStep(state.stepX) : undefined,
        y: fineControl && options.fine ? getFineStep(state.stepY) : undefined,
      };

      return createXYPadState(nextValue, {
        minX,
        maxX,
        stepX,
        minY,
        maxY,
        stepY,
        valueStepX: nextValueStep.x,
        valueStepY: nextValueStep.y,
      });
    },
    [fineControl, maxX, maxY, minX, minY, state.stepX, state.stepY, stepX, stepY],
  );

  const setValue = useCallback(
    (nextValue: { x: number; y: number }, options: XYPadValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      const nextValueStep = {
        x: fineControl && options.fine ? getFineStep(state.stepX) : undefined,
        y: fineControl && options.fine ? getFineStep(state.stepY) : undefined,
      };
      setValueStep(nextValueStep);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value.x !== state.value.x || nextState.value.y !== state.value.y) {
        onValueChange?.(nextState.value);
      }
    },
    [
      fineControl,
      getStateForValue,
      isControlled,
      onValueChange,
      state.stepX,
      state.stepY,
      state.value.x,
      state.value.y,
    ],
  );

  const commitValue = useCallback(
    (nextValue: { x: number; y: number }, options: XYPadValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);
      onValueCommit?.(nextState.value);
    },
    [getStateForValue, onValueCommit],
  );

  const resetValue = useCallback(() => {
    setValue(resetValueTarget);
    commitValue(resetValueTarget);
  }, [commitValue, resetValueTarget, setValue]);

  const contextValue = useMemo<XYPadContextValue>(
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
      areaRef,
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
      areaRef,
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
    "data-audio-ui": "xypad",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-track-click-disabled": allowTrackClick ? undefined : "",
    "data-dragging": dragging ? "" : undefined,
    style: {
      ...style,
      "--xypad-x": state.value.x,
      "--xypad-y": state.value.y,
      "--xypad-x-percent": state.xPercent,
      "--xypad-y-percent": state.yPercent,
    } as CSSProperties,
  });

  return (
    <XYPadContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </XYPadContext.Provider>
  );
});
