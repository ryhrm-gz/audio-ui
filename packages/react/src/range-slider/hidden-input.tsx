import { forwardRef } from "react";
import { useRangeSliderContext } from "./context.tsx";
import type { RangeSliderHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, RangeSliderHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useRangeSliderContext("RangeSlider.HiddenInput");

    return (
      <input
        {...elementProps}
        ref={ref}
        type="hidden"
        name={name ?? context.name}
        required={required ?? context.required}
        disabled={disabled ?? context.disabled}
        value={JSON.stringify(context.state.value)}
      />
    );
  },
);
