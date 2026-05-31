import { forwardRef } from "react";
import { useEnvelopeEditorContext } from "./context.tsx";
import type { EnvelopeEditorHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, EnvelopeEditorHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useEnvelopeEditorContext("EnvelopeEditor.HiddenInput");

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
