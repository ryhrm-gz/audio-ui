import {
  createToggleButtonState,
  getNextToggleButtonPressed,
  type ToggleButtonAction,
} from "@ryhrm-gz/audio-ui-core";
import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { ToggleButtonContext, type ToggleButtonContextValue } from "./context.tsx";
import type { ToggleButtonRootProps } from "./types.ts";

export const Root = forwardRef<HTMLButtonElement, ToggleButtonRootProps>(function Root(props, ref) {
  const {
    pressed,
    defaultPressed = false,
    mode = "toggle",
    disabled = false,
    name,
    value = "on",
    required,
    children,
    onPressedChange,
    render,
    type = "button",
    ...elementProps
  } = props;
  const isControlled = pressed !== undefined;
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const rawPressed = isControlled ? pressed : internalPressed;
  const state = useMemo(() => createToggleButtonState(rawPressed, { mode }), [mode, rawPressed]);

  const setPressedFromAction = useCallback(
    (action: ToggleButtonAction) => {
      const nextPressed = getNextToggleButtonPressed(state.pressed, action, {
        disabled,
        mode: state.mode,
      });

      if (nextPressed === state.pressed) {
        return;
      }

      if (!isControlled) {
        setInternalPressed(nextPressed);
      }

      onPressedChange?.(nextPressed);
    },
    [disabled, isControlled, onPressedChange, state.mode, state.pressed],
  );
  const releaseMomentary = useCallback(() => {
    if (state.mode === "momentary") {
      setPressedFromAction("release");
    }
  }, [setPressedFromAction, state.mode]);
  const handleClick = useCallback(() => {
    if (state.mode === "toggle") {
      setPressedFromAction("toggle");
    }
  }, [setPressedFromAction, state.mode]);
  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || state.mode !== "momentary") {
        return;
      }

      setPressedFromAction("press");
    },
    [setPressedFromAction, state.mode],
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.repeat || state.mode !== "momentary" || !isKeyboardPressKey(event.key)) {
        return;
      }

      setPressedFromAction("press");
    },
    [setPressedFromAction, state.mode],
  );
  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (state.mode !== "momentary" || !isKeyboardPressKey(event.key)) {
        return;
      }

      setPressedFromAction("release");
    },
    [setPressedFromAction, state.mode],
  );
  const handleBlur = useCallback(
    (_event: FocusEvent<HTMLButtonElement>) => {
      releaseMomentary();
    },
    [releaseMomentary],
  );
  const contextValue = useMemo<ToggleButtonContextValue>(
    () => ({
      state,
      disabled,
      name,
      value,
      required,
    }),
    [disabled, name, required, state, value],
  );
  const renderState = getRenderState(state, {
    disabled,
    readOnly: false,
    dragging: state.mode === "momentary" && state.pressed,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    type,
    disabled,
    "aria-pressed": state.pressed,
    "data-audio-ui": "toggle-button",
    "data-part": "root",
    "data-mode": state.mode,
    "data-state": state.pressed ? "on" : "off",
    "data-pressed": state.pressed ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    onClick: handleClick,
    onPointerDown: handlePointerDown,
    onPointerUp: releaseMomentary,
    onPointerCancel: releaseMomentary,
    onPointerLeave: releaseMomentary,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,
  });

  return (
    <ToggleButtonContext.Provider value={contextValue}>
      {renderElement("button", render, rootProps, renderState, content)}
    </ToggleButtonContext.Provider>
  );
});

function isKeyboardPressKey(key: string): boolean {
  return key === " " || key === "Enter";
}
