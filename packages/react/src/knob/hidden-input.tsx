import { forwardRef } from "react";
import { useKnobContext } from "./context.tsx";
import type { KnobHiddenInputProps } from "./types.ts";

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
