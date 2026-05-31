import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { LevelMeter } from "../index.ts";

describe("LevelMeter", () => {
  test("renders the root, scale, track, bars, peaks, and value parts", () => {
    const markup = renderToStaticMarkup(
      <LevelMeter.Root aria-label="Output level" channels={2} peak={[-6, 1]} value={[-12, -3]}>
        <LevelMeter.Scale />
        <LevelMeter.Track>
          <LevelMeter.Segments />
          <LevelMeter.Bar channel={0}>
            <LevelMeter.Segments channel={0} />
          </LevelMeter.Bar>
          <LevelMeter.Peak channel={0} />
          <LevelMeter.Bar channel={1} />
          <LevelMeter.Peak channel={1} />
        </LevelMeter.Track>
        <LevelMeter.Value format={(value) => `${value} dB`} />
      </LevelMeter.Root>,
    );

    expect(markup).toContain('data-audio-ui="level-meter"');
    expect(markup).toContain('role="meter"');
    expect(markup).toContain('aria-valuemin="-60"');
    expect(markup).toContain('aria-valuemax="6"');
    expect(markup).toContain('aria-valuenow="-3"');
    expect(markup).toContain('data-part="scale"');
    expect(markup).toContain('data-part="scale-mark"');
    expect(markup).toContain('data-part="track"');
    expect(markup).toContain('data-part="segments"');
    expect(markup).toContain('data-part="segment"');
    expect(markup).toContain('data-segment="warning"');
    expect(markup).toContain('data-part="bar"');
    expect(markup).toContain('data-part="peak"');
    expect(markup).toContain('data-channel="1"');
    expect(markup).toContain('data-clipped=""');
    expect(markup).toContain("-3 dB");
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <LevelMeter.Root disabled value={[-18, -12]} channels={2}>
        {(state) => (
          <>
            <LevelMeter.Track>
              <LevelMeter.Bar />
            </LevelMeter.Track>
            <LevelMeter.Value>
              {state.channels.length}:{state.maxValue}
            </LevelMeter.Value>
          </>
        )}
      </LevelMeter.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain(">2:-12</span>");
  });

  test("supports custom scale labels", () => {
    const markup = renderToStaticMarkup(
      <LevelMeter.Root
        scale={[
          { value: -60, percent: 0, label: "floor" },
          { value: 0, percent: 1, label: "clip" },
        ]}
        value={-12}
      >
        <LevelMeter.Scale>{(mark) => mark.label}</LevelMeter.Scale>
      </LevelMeter.Root>,
    );

    expect(markup).toContain("floor");
    expect(markup).toContain("clip");
  });

  test("supports custom segments", () => {
    const markup = renderToStaticMarkup(
      <LevelMeter.Root
        segments={[
          { id: "green", from: -60, to: -18, label: "Green" },
          { id: "yellow", from: -18, to: -3, label: "Yellow" },
          { id: "red", from: -3, to: 6, label: "Red" },
        ]}
        value={-12}
      >
        <LevelMeter.Segments>{(segment) => segment.label}</LevelMeter.Segments>
      </LevelMeter.Root>,
    );

    expect(markup).toContain('data-segment="green"');
    expect(markup).toContain('data-segment="yellow"');
    expect(markup).toContain('data-segment="red"');
    expect(markup).toContain("Green");
    expect(markup).toContain("Yellow");
    expect(markup).toContain("Red");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<LevelMeter.Bar />)).toThrow(
      "LevelMeter.Bar must be used inside LevelMeter.Root.",
    );
  });
});
