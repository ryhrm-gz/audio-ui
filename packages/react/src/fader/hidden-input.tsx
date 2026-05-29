import { forwardRef } from "react";
import { useFaderContext } from "./context.tsx";
import type { FaderHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, FaderHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useFaderContext("Fader.HiddenInput");

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
