import { Fragment, forwardRef } from "react";
import { useToggleGroupContext } from "./context.tsx";
import type { ToggleGroupHiddenInputProps } from "./types.ts";

export const HiddenInput = forwardRef<HTMLInputElement, ToggleGroupHiddenInputProps>(
  function HiddenInput(props, ref) {
    const { name, required, disabled, ...elementProps } = props;
    const context = useToggleGroupContext("ToggleGroup.HiddenInput");
    const inputName = name ?? context.name;
    const inputRequired = required ?? context.required;
    const inputDisabled = disabled ?? context.disabled;

    if (context.state.type === "multiple") {
      return (
        <>
          {context.state.values.map((value, index) => (
            <input
              {...elementProps}
              key={value}
              ref={index === 0 ? ref : undefined}
              type="hidden"
              name={inputName}
              value={value}
              required={inputRequired}
              disabled={inputDisabled}
              data-part="hidden-input"
            />
          ))}
        </>
      );
    }

    return (
      <Fragment>
        <input
          {...elementProps}
          ref={ref}
          type="hidden"
          name={inputName}
          value={context.state.values[0] ?? ""}
          required={inputRequired}
          disabled={inputDisabled}
          data-part="hidden-input"
        />
      </Fragment>
    );
  },
);
