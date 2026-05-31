import { forwardRef } from "react";
import { useToggleButtonContext } from "./context.tsx";
import type { ToggleButtonHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, ToggleButtonHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, value, required, disabled, ...elementProps } = props;
    const context = useToggleButtonContext("ToggleButton.HiddenInput");

    if (!context.state.pressed) {
      return null;
    }

    return (
      <input
        {...elementProps}
        ref={ref}
        type="hidden"
        name={name ?? context.name}
        value={value ?? context.value}
        required={required ?? context.required}
        disabled={disabled ?? context.disabled}
        data-part="hidden-input"
      />
    );
  },
);
