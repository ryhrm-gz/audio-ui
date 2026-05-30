import { createPianoState, type PianoKeyInput, type PianoState } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useMemo, useState, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { PianoContext, type PianoContextValue } from "./context.tsx";
import { resolvePianoKey } from "./resolve-key.ts";
import type { PianoRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, PianoRootProps>(function Root(props, ref) {
  const {
    pressedKeys,
    defaultPressedKeys,
    startKey,
    keyCount,
    disabled = false,
    readOnly = false,
    allowMultiple = true,
    children,
    onPressedKeysChange,
    onPressKey,
    onReleaseKey,
    render,
    style,
    ...elementProps
  } = props;
  const isControlled = pressedKeys !== undefined;
  const [internalPressedKeys, setInternalPressedKeys] = useState<readonly PianoKeyInput[]>(
    defaultPressedKeys ?? [],
  );
  const rawPressedKeys = isControlled ? pressedKeys : internalPressedKeys;
  const state = useMemo(
    () => createPianoState(rawPressedKeys, { startKey, keyCount }),
    [rawPressedKeys, startKey, keyCount],
  );

  const commitPressedKeys = useCallback(
    (nextPressedKeys: readonly PianoKeyInput[]): PianoState => {
      const nextState = createPianoState(nextPressedKeys, { startKey, keyCount });

      if (areKeyIdsEqual(state.pressedKeyIds, nextState.pressedKeyIds)) {
        return nextState;
      }

      if (!isControlled) {
        setInternalPressedKeys(nextState.pressedKeyIds);
      }

      onPressedKeysChange?.(nextState.pressedKeys);

      return nextState;
    },
    [isControlled, keyCount, onPressedKeysChange, startKey, state.pressedKeyIds],
  );

  const getKey = useCallback(
    (key: PianoKeyInput) => resolvePianoKey(state.keys, key),
    [state.keys],
  );

  const pressKey = useCallback(
    (keyInput: PianoKeyInput) => {
      if (disabled || readOnly) {
        return;
      }

      const key = getKey(keyInput);

      if (key === undefined || state.pressedKeyIds.includes(key.id)) {
        return;
      }

      const nextPressedKeyIds = allowMultiple ? [...state.pressedKeyIds, key.id] : [key.id];
      commitPressedKeys(nextPressedKeyIds);
      onPressKey?.({ ...key, pressed: true });
    },
    [allowMultiple, commitPressedKeys, disabled, getKey, onPressKey, readOnly, state.pressedKeyIds],
  );

  const releaseKey = useCallback(
    (keyInput: PianoKeyInput) => {
      if (disabled || readOnly) {
        return;
      }

      const key = getKey(keyInput);

      if (key === undefined || !state.pressedKeyIds.includes(key.id)) {
        return;
      }

      commitPressedKeys(state.pressedKeyIds.filter((keyId) => keyId !== key.id));
      onReleaseKey?.({ ...key, pressed: false });
    },
    [commitPressedKeys, disabled, getKey, onReleaseKey, readOnly, state.pressedKeyIds],
  );

  const contextValue = useMemo<PianoContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      allowMultiple,
      pressKey,
      releaseKey,
      getKey,
    }),
    [allowMultiple, disabled, getKey, pressKey, readOnly, releaseKey, state],
  );
  const renderState = getRenderState(state, { disabled, readOnly, dragging: false });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    role: "group",
    "data-audio-ui": "piano",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-pressed": state.pressedKeyIds.length > 0 ? "" : undefined,
    style: {
      ...style,
      "--piano-key-count": state.keyCount,
      "--piano-white-key-count": state.whiteKeyCount,
    } as CSSProperties,
  });

  return (
    <PianoContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </PianoContext.Provider>
  );
});

function areKeyIdsEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((keyId, index) => keyId === right[index]);
}
