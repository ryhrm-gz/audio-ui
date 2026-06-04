import {
  createEnvelopeEditorState,
  defaultEnvelopeEditorValue,
  envelopeEditorValuesEqual,
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
import { resolveFineAxisFactor } from "../shared/fine-control.ts";
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
      draggingPoint,
    ],
  );
  const valueId = useId();
  const graphRef = useRef<HTMLDivElement | null>(null);
  const getFineFactor = useCallback(
    (axis: "time" | "level") => resolveFineAxisFactor(axis, fineControl),
    [fineControl],
  );

  const getStateForValue = useCallback(
    (
      nextValue: EnvelopeEditorValue,
      options: EnvelopeEditorValueChangeOptions = {},
    ): EnvelopeEditorState => {
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
        activePoint: options.activePoint ?? draggingPoint,
      });
    },
    [
      disabled,
      draggingPoint,
      maxLevel,
      maxTime,
      minLevel,
      minTime,
      mode,
      readOnly,
      stepLevel,
      stepTime,
    ],
  );

  const setValue = useCallback(
    (nextValue: EnvelopeEditorValue, options: EnvelopeEditorValueChangeOptions = {}) => {
      const nextState = getStateForValue(nextValue, options);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!envelopeEditorValuesEqual(nextState.value, state.value)) {
        onValueChange?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value],
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
      getFineFactor,
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
      getFineFactor,
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
