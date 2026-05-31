import { forwardRef, useCallback, useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useComposedRefs } from "../shared/refs.ts";
import { useToggleGroupContext } from "./context.tsx";
import type { ToggleGroupItemProps } from "./types.ts";

export const Item = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function Item(props, ref) {
  const { value, disabled = false, children, render, type = "button", ...elementProps } = props;
  const context = useToggleGroupContext("ToggleGroup.Item");
  const localRef = useRef<HTMLButtonElement | null>(null);
  const composedRef = useComposedRefs(localRef, ref);
  const itemDisabled = context.disabled || disabled;
  const pressed = context.isItemPressed(value);
  const itemState = useMemo(
    () => ({
      ...context.state,
      pressed,
    }),
    [context.state, pressed],
  );
  const handleClick = useCallback(() => {
    context.setItemValue(value, itemDisabled);
  }, [context, itemDisabled, value]);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (context.moveFocus(value, event.key)) {
        event.preventDefault();
      }
    },
    [context, value],
  );

  useEffect(
    () =>
      context.registerItem({
        value,
        disabled: itemDisabled,
        ref: localRef,
      }),
    [context, itemDisabled, value],
  );

  const renderState = getRenderState(itemState, {
    disabled: itemDisabled,
    readOnly: false,
    dragging: false,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const itemProps = mergeProps(elementProps, {
    ref: composedRef,
    type,
    disabled: itemDisabled,
    "aria-pressed": pressed,
    "data-part": "item",
    "data-value": value,
    "data-orientation": context.state.orientation,
    "data-state": pressed ? "on" : "off",
    "data-pressed": pressed ? "" : undefined,
    "data-disabled": itemDisabled ? "" : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  });

  return renderElement("button", render, itemProps, renderState, content);
});
