import {
  createToggleGroupState,
  getNextToggleGroupFocusedIndex,
  getNextToggleGroupValue,
  isToggleGroupItemPressed,
  type ToggleGroupValue,
} from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import {
  ToggleGroupContext,
  type ToggleGroupContextValue,
  type ToggleGroupRegisteredItem,
} from "./context.tsx";
import type { ToggleGroupRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, ToggleGroupRootProps>(function Root(props, ref) {
  const {
    type = "single",
    value,
    defaultValue,
    allowEmpty = false,
    orientation = "horizontal",
    disabled = false,
    name,
    required,
    children,
    onValueChange,
    render,
    ...elementProps
  } = props;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<ToggleGroupValue | undefined>(defaultValue);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () => createToggleGroupState(rawValue, { allowEmpty, orientation, type }),
    [allowEmpty, orientation, rawValue, type],
  );
  const itemsRef = useRef<ToggleGroupRegisteredItem[]>([]);

  const setValue = useCallback(
    (nextValue: string, itemDisabled = false) => {
      const nextGroupValue = getNextToggleGroupValue(state.value, nextValue, {
        allowEmpty,
        disabled: disabled || itemDisabled,
        type: state.type,
      });
      const nextState = createToggleGroupState(nextGroupValue, {
        allowEmpty,
        orientation,
        type: state.type,
      });

      if (areToggleGroupValuesEqual(state.values, nextState.values)) {
        return;
      }

      if (!isControlled) {
        setInternalValue(nextGroupValue);
      }

      onValueChange?.(nextGroupValue);
    },
    [
      allowEmpty,
      disabled,
      isControlled,
      onValueChange,
      orientation,
      state.type,
      state.value,
      state.values,
    ],
  );
  const isPressed = useCallback(
    (itemValue: string) => isToggleGroupItemPressed(state.value, itemValue, { type: state.type }),
    [state.type, state.value],
  );
  const registerItem = useCallback((item: ToggleGroupRegisteredItem) => {
    itemsRef.current = [...itemsRef.current, item];

    return () => {
      itemsRef.current = itemsRef.current.filter((currentItem) => currentItem !== item);
    };
  }, []);
  const moveFocus = useCallback(
    (itemValue: string, key: string): boolean => {
      const items = itemsRef.current;
      const currentIndex = items.findIndex((item) => item.value === itemValue);
      const nextIndex = getNextToggleGroupFocusedIndex(currentIndex, key, items, {
        orientation: state.orientation,
      });

      if (nextIndex === undefined) {
        return false;
      }

      items[nextIndex]?.ref.current?.focus();
      return true;
    },
    [state.orientation],
  );
  const contextValue = useMemo<ToggleGroupContextValue>(
    () => ({
      state,
      disabled,
      name,
      required,
      setItemValue: setValue,
      isItemPressed: isPressed,
      registerItem,
      moveFocus,
    }),
    [disabled, isPressed, moveFocus, name, registerItem, required, setValue, state],
  );
  const renderState = getRenderState(state, { disabled, readOnly: false, dragging: false });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    role: "group",
    "data-audio-ui": "toggle-group",
    "data-part": "root",
    "data-type": state.type,
    "data-orientation": state.orientation,
    "data-disabled": disabled ? "" : undefined,
  });

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </ToggleGroupContext.Provider>
  );
});

function areToggleGroupValuesEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
