import {
  forwardRef,
  useCallback,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { usePianoContext } from "./context.tsx";
import type { PianoKeyProps } from "./types.ts";

export const Key = forwardRef<HTMLButtonElement, PianoKeyProps>(function Key(props, ref) {
  const { pianoKey, children, render, style, type = "button", ...elementProps } = props;
  const context = usePianoContext("Piano.Key");
  const { disabled, readOnly, pressKey, releaseKey, getKey } = context;
  const key = getKey(pianoKey);

  if (key === undefined) {
    throw new Error(
      `Piano.Key could not find "${formatPianoKeyInput(pianoKey)}" in the current Piano.Root range.`,
    );
  }

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      pressKey(key.id);
    },
    [key.id, pressKey],
  );
  const handlePointerUp = useCallback(() => {
    releaseKey(key.id);
  }, [key.id, releaseKey]);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.repeat || !isKeyboardPressKey(event.key)) {
        return;
      }

      event.preventDefault();
      pressKey(key.id);
    },
    [key.id, pressKey],
  );
  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!isKeyboardPressKey(event.key)) {
        return;
      }

      event.preventDefault();
      releaseKey(key.id);
    },
    [key.id, releaseKey],
  );
  const handleBlur = useCallback(
    (_event: FocusEvent<HTMLButtonElement>) => {
      releaseKey(key.id);
    },
    [key.id, releaseKey],
  );
  const renderState = getRenderState(key, {
    disabled,
    readOnly,
    dragging: key.pressed,
  });
  const content = typeof children === "function" ? children(renderState) : children;
  const keyProps = mergeProps(elementProps, {
    ref,
    type,
    disabled,
    "aria-pressed": key.pressed,
    "aria-readonly": readOnly ? true : undefined,
    "data-part": "key",
    "data-key-id": key.id,
    "data-note": key.note,
    "data-octave": key.octave,
    "data-midi": key.midi,
    "data-color": key.color,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-pressed": key.pressed ? "" : undefined,
    "data-dragging": key.pressed ? "" : undefined,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onPointerLeave: handlePointerUp,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,
    style: {
      ...style,
      "--piano-key-index": key.index,
      "--piano-key-midi": key.midi,
      "--piano-white-key-index": key.whiteIndex,
      "--piano-black-key-index": key.blackIndex,
      "--piano-key-start-percent": key.startPercent,
      "--piano-key-size-percent": key.sizePercent,
    } as CSSProperties,
  });

  return renderElement("button", render, keyProps, renderState, content ?? key.id);
});

function isKeyboardPressKey(key: string): boolean {
  return key === " " || key === "Enter";
}

function formatPianoKeyInput(key: PianoKeyProps["pianoKey"]): string {
  if (typeof key === "object") {
    return `${key.note}${key.octave}`;
  }

  return String(key);
}
