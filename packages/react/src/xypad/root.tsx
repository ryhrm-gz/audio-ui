import { createXYPadState, type XYPadState } from "@ryhrm-gz/audio-ui-core";
import { resolveFineAxisFactor } from "../shared/fine-control.ts";
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
      }),
    [rawValue, minX, maxX, stepX, minY, maxY, stepY],
  );
  const valueId = useId();
  const areaRef = useRef<HTMLDivElement | null>(null);
  const getFineFactor = useCallback(
    (axis: "x" | "y") => resolveFineAxisFactor(axis, fineControl),
    [fineControl],
  );

  const getStateForValue = useCallback(
    (nextValue: { x: number; y: number }, _options: XYPadValueChangeOptions = {}): XYPadState => {
      return createXYPadState(nextValue, {
        minX,
        maxX,
        stepX,
        minY,
        maxY,
        stepY,
      });
    },
    [maxX, maxY, minX, minY, stepX, stepY],
  );

  const setValue = useCallback(
    (nextValue: { x: number; y: number }, options: XYPadValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value.x !== state.value.x || nextState.value.y !== state.value.y) {
        onValueChange?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value.x, state.value.y],
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
      getFineFactor,
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
      getFineFactor,
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
