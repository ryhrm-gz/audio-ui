import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Slider } from "./index.ts";

describe("Slider", () => {
  test("renders the root, track, range, thumb, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root defaultValue={25} max={50} min={0} name="mix" required step={5}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb aria-label="Mix" />
        </Slider.Track>
        <Slider.Value format={(value) => `${value}%`} />
        <Slider.HiddenInput />
      </Slider.Root>,
    );

    expect(markup).toContain('data-audio-ui="slider"');
    expect(markup).toContain('data-part="track"');
    expect(markup).toContain('data-part="range"');
    expect(markup).toContain('data-part="thumb"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-orientation="horizontal"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="50"');
    expect(markup).toContain('aria-valuenow="25"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("25%");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="mix"');
    expect(markup).toContain('value="25"');
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root disabled inverted orientation="vertical" readOnly value={10} max={20} min={0}>
        {(state) => (
          <>
            <Slider.Track>
              <Slider.Thumb aria-label="Level" />
            </Slider.Track>
            <Slider.Value>{state.percent}</Slider.Value>
          </>
        )}
      </Slider.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('data-inverted=""');
    expect(markup).toContain('data-orientation="vertical"');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain('aria-orientation="vertical"');
    expect(markup).toContain(">0.5</span>");
  });

  test("disables track click value changes by default", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root defaultValue={25}>
        <Slider.Track>
          <Slider.Thumb aria-label="Mix" />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(markup).toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("can enable track click value changes", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root allowTrackClick defaultValue={25}>
        <Slider.Track>
          <Slider.Thumb aria-label="Mix" />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(markup).not.toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Slider.Thumb />)).toThrow(
      "Slider.Thumb must be used inside Slider.Root.",
    );
  });
});
