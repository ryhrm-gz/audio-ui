import { Fragment, forwardRef, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { usePianoContext } from "./context.tsx";
import { Key } from "./key.tsx";
import type { PianoKeysProps } from "./types.ts";

export const Keys = forwardRef<HTMLDivElement, PianoKeysProps>(function Keys(props, ref) {
  const { children, render, style, ...elementProps } = props;
  const context = usePianoContext("Piano.Keys");
  const { state, disabled, readOnly } = context;
  const renderState = getRenderState(state, { disabled, readOnly, dragging: false });
  const content =
    typeof children === "function"
      ? state.keys.map((key) => (
          <Fragment key={key.id}>
            {children(getRenderState(key, { disabled, readOnly, dragging: false }), renderState)}
          </Fragment>
        ))
      : (children ??
        state.keys.map((key) => (
          <Key key={key.id} pianoKey={key.id}>
            {key.id}
          </Key>
        )));
  const keysProps = mergeProps(elementProps, {
    ref,
    role: "group",
    "data-part": "keys",
    style: {
      ...style,
      "--piano-key-count": state.keyCount,
      "--piano-white-key-count": state.whiteKeyCount,
    } as CSSProperties,
  });

  return renderElement("div", render, keysProps, renderState, content);
});
