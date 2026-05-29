import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Knob } from "./index.ts";

describe("Knob", () => {
  test("renders the root, control, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root defaultValue={25} max={50} min={0} name="gain" required step={5}>
        <Knob.Control aria-label="Gain" />
        <Knob.Value format={(value) => `${value} dB`} />
        <Knob.HiddenInput />
      </Knob.Root>,
    );

    expect(markup).toContain('data-audio-ui="knob"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="50"');
    expect(markup).toContain('aria-valuenow="25"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("25 dB");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="gain"');
    expect(markup).toContain('value="25"');
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root disabled readOnly value={10} max={20} min={0}>
        {(state) => (
          <>
            <Knob.Control aria-label="Ratio" />
            <Knob.Value>{state.percent}</Knob.Value>
          </>
        )}
      </Knob.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain(">0.5</span>");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Knob.Control />)).toThrow(
      "Knob.Control must be used inside Knob.Root.",
    );
  });
});
