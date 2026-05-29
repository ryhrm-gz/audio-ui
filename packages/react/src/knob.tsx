import {
  createKnobState,
  getKnobValueFromLinearDrag,
  getKnobValueFromPoint,
  getNextKeyboardValue,
  type KnobAngleRange,
  type KnobDragMode,
  type KnobRange,
  type KnobState,
} from "@audio-ui/core";
import {
  cloneElement,
  createContext,
  createElement,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

type DataAttributes = Record<`data-${string}`, string | number | boolean | undefined>;
type ElementProps = Record<string, unknown>;
type RenderState<TState> = TState & DataAttributes;
type RenderProp<TProps extends ElementProps, TState> =
  | ReactElement
  | ((props: TProps, state: RenderState<TState>) => ReactElement | null);

interface KnobContextValue {
  state: KnobState;
  dragMode: KnobDragMode;
  disabled: boolean;
  readOnly: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number) => void;
  commitValue: (value: number) => void;
}

export interface KnobRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    KnobRange,
    KnobAngleRange {
  value?: number;
  defaultValue?: number;
  dragMode?: KnobDragMode;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<KnobState>) => ReactNode);
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobControlProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobThumbProps extends ComponentPropsWithoutRef<"span"> {
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<KnobState>) => ReactNode);
  format?: (value: number, state: KnobState) => ReactNode;
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}

interface ActiveDrag {
  pointerId: number;
  startValue: number;
  startX: number;
  startY: number;
  trackSize: number;
}

const KnobContext = createContext<KnobContextValue | undefined>(undefined);

export const Root = forwardRef<HTMLDivElement, KnobRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    dragMode = "radial",
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

  const setValue = useCallback(
    (nextValue: number) => {
      const nextState = createKnobState(nextValue, { min, max, step, minAngle, maxAngle });

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (nextState.value !== state.value) {
        onValueChange?.(nextState.value);
      }
    },
    [isControlled, max, maxAngle, min, minAngle, onValueChange, state.value, step],
  );

  const commitValue = useCallback(
    (nextValue: number) => {
      const nextState = createKnobState(nextValue, { min, max, step, minAngle, maxAngle });
      onValueCommit?.(nextState.value);
    },
    [max, maxAngle, min, minAngle, onValueCommit, step],
  );

  const contextValue = useMemo<KnobContextValue>(
    () => ({
      state,
      dragMode,
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
      dragMode,
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
    "data-drag-mode": dragMode,
  });

  return (
    <KnobContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </KnobContext.Provider>
  );
});

export const Control = forwardRef<HTMLDivElement, KnobControlProps>(function Control(props, ref) {
  const {
    render,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
    style,
    ...elementProps
  } = props;
  const context = useKnobContext("Knob.Control");
  const controlRef = useRef<HTMLDivElement | null>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const composedRef = useComposedRefs(ref, controlRef);
  const disabled = context.disabled;
  const readOnly = context.readOnly;

  const updateValueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const element = controlRef.current;

      if (element === null) {
        return;
      }

      let nextValue: number;

      if (context.dragMode === "radial") {
        const rect = element.getBoundingClientRect();
        nextValue = getKnobValueFromPoint(
          {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            pointX: event.clientX,
            pointY: event.clientY,
          },
          context.state,
        );
      } else {
        const activeDrag = activeDragRef.current;

        if (activeDrag === null || activeDrag.pointerId !== event.pointerId) {
          return;
        }

        nextValue = getKnobValueFromLinearDrag(
          {
            mode: context.dragMode,
            startValue: activeDrag.startValue,
            startX: activeDrag.startX,
            startY: activeDrag.startY,
            pointX: event.clientX,
            pointY: event.clientY,
            trackSize: activeDrag.trackSize,
          },
          context.state,
        );
      }

      context.setValue(nextValue);
    },
    [context],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);

    if (event.defaultPrevented || disabled || readOnly || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    activeDragRef.current = {
      pointerId: event.pointerId,
      startValue: context.state.value,
      startX: event.clientX,
      startY: event.clientY,
      trackSize: Math.max(rect.width, rect.height),
    };
    context.setDragging(true);

    if (context.dragMode === "radial") {
      updateValueFromPointer(event);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    updateValueFromPointer(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    context.setDragging(false);
    activeDragRef.current = null;
    context.commitValue(context.state.value);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);

    if (event.defaultPrevented || disabled || readOnly || !context.dragging) {
      return;
    }

    context.setDragging(false);
    activeDragRef.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const nextValue = getNextKeyboardValue(context.state.value, event.key, context.state);

    if (nextValue === undefined) {
      return;
    }

    event.preventDefault();
    context.setValue(nextValue);
    context.commitValue(nextValue);
  };

  const renderState = getRenderState(context.state, {
    disabled,
    readOnly,
    dragging: context.dragging,
  });
  const controlProps = mergeProps(elementProps, {
    ref: composedRef,
    role: "slider",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-readonly": readOnly || undefined,
    "aria-valuemin": context.state.min,
    "aria-valuemax": context.state.max,
    "aria-valuenow": context.state.value,
    "aria-valuetext": String(context.state.value),
    "aria-describedby": context.valueId,
    "data-part": "control",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    "data-drag-mode": context.dragMode,
    style: {
      ...style,
      "--knob-value": context.state.value,
      "--knob-percent": context.state.percent,
      "--knob-angle": `${context.state.angle}deg`,
    } as CSSProperties,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onKeyDown: handleKeyDown,
  });

  return renderElement("div", render, controlProps, renderState);
});

export const Thumb = forwardRef<HTMLSpanElement, KnobThumbProps>(function Thumb(props, ref) {
  const { render, style, ...elementProps } = props;
  const context = useKnobContext("Knob.Thumb");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const thumbProps = mergeProps(elementProps, {
    ref,
    "aria-hidden": true,
    "data-part": "thumb",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
    style: {
      ...style,
      "--knob-value": context.state.value,
      "--knob-percent": context.state.percent,
      "--knob-angle": `${context.state.angle}deg`,
    } as CSSProperties,
  });

  return renderElement("span", render, thumbProps, renderState);
});

export const Value = forwardRef<HTMLSpanElement, KnobValueProps>(function Value(props, ref) {
  const { render, children, format, ...elementProps } = props;
  const context = useKnobContext("Knob.Value");
  const renderState = getRenderState(context.state, {
    disabled: context.disabled,
    readOnly: context.readOnly,
    dragging: context.dragging,
  });
  const content =
    typeof children === "function"
      ? children(renderState)
      : (children ?? format?.(context.state.value, context.state) ?? context.state.value);
  const valueProps = mergeProps(elementProps, {
    ref,
    id: context.valueId,
    "data-part": "value",
    "data-disabled": context.disabled ? "" : undefined,
    "data-readonly": context.readOnly ? "" : undefined,
    "data-dragging": context.dragging ? "" : undefined,
  });

  return renderElement("span", render, valueProps, renderState, content);
});

export const HiddenInput = forwardRef<HTMLInputElement, KnobHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useKnobContext("Knob.HiddenInput");

    return (
      <input
        {...elementProps}
        ref={ref}
        type="hidden"
        name={name ?? context.name}
        required={required ?? context.required}
        disabled={disabled ?? context.disabled}
        value={context.state.value}
      />
    );
  },
);

export const Knob = {
  Root,
  Control,
  Thumb,
  Value,
  HiddenInput,
};

export type { KnobDragMode };

function useKnobContext(partName: string) {
  const context = useContext(KnobContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Knob.Root.`);
  }

  return context;
}

function getRenderState(
  state: KnobState,
  flags: { disabled: boolean; readOnly: boolean; dragging: boolean },
) {
  return {
    ...state,
    "data-disabled": flags.disabled ? "" : undefined,
    "data-readonly": flags.readOnly ? "" : undefined,
    "data-dragging": flags.dragging ? "" : undefined,
  };
}

function renderElement<TProps extends ElementProps, TState>(
  fallback: ElementType,
  render: RenderProp<TProps, TState> | undefined,
  props: TProps,
  state: RenderState<TState>,
  children?: ReactNode,
) {
  const nextProps =
    children === undefined
      ? props
      : ({
          ...props,
          children,
        } as TProps);

  if (typeof render === "function") {
    return render(nextProps, state);
  }

  if (isValidElement(render)) {
    return cloneElement(render, mergeProps(render.props as ElementProps, nextProps));
  }

  return createElement(fallback, nextProps);
}

function mergeProps(...propsList: ElementProps[]) {
  const mergedProps: ElementProps = {};

  for (const props of propsList) {
    for (const [key, value] of Object.entries(props)) {
      const existingValue = mergedProps[key];

      if (
        key.startsWith("on") &&
        typeof existingValue === "function" &&
        typeof value === "function"
      ) {
        mergedProps[key] = (...args: unknown[]) => {
          existingValue(...args);
          value(...args);
        };
        continue;
      }

      if (key === "style" && isPlainObject(existingValue) && isPlainObject(value)) {
        mergedProps[key] = {
          ...existingValue,
          ...value,
        };
        continue;
      }

      if (value !== undefined) {
        mergedProps[key] = value;
      }
    }
  }

  return mergedProps;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function useComposedRefs<TElement>(
  ...refs: Array<Ref<TElement> | MutableRefObject<TElement | null>>
) {
  return useCallback(
    (node: TElement | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref !== null) {
          ref.current = node;
        }
      }
    },
    [refs],
  );
}
