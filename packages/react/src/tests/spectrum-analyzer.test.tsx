import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  SpectrumAnalyzer,
  SpectrumAnalyzerBars,
  SpectrumAnalyzerCurve,
  SpectrumAnalyzerGraph,
  SpectrumAnalyzerHiddenInput,
  SpectrumAnalyzerRoot,
  SpectrumAnalyzerValue,
} from "../index.ts";

const bins = [
  { id: "sub", frequency: 40, magnitude: -42 },
  { id: "body", frequency: 160, magnitude: -18 },
  { id: "presence", frequency: 3200, magnitude: -9 },
  { id: "air", frequency: 12000, magnitude: -24 },
] as const;

describe("SpectrumAnalyzer", () => {
  test("renders root, graph, bars, curve, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <SpectrumAnalyzer.Root aria-label="Spectrum" name="spectrum" required value={[...bins]}>
        <SpectrumAnalyzer.Graph>
          <SpectrumAnalyzer.Bars />
          <SpectrumAnalyzer.Curve />
        </SpectrumAnalyzer.Graph>
        <SpectrumAnalyzer.Value />
        <SpectrumAnalyzer.HiddenInput />
      </SpectrumAnalyzer.Root>,
    );

    expect(markup).toContain('data-audio-ui="spectrum-analyzer"');
    expect(markup).toContain('role="img"');
    expect(markup).toContain('data-frequency-scale="log"');
    expect(markup).toContain('aria-valuetext="-9.0 dB at 3200 Hz"');
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain('data-part="bars"');
    expect(markup).toContain('data-part="bars-path"');
    expect(markup).toContain('viewBox="0 0 1 1"');
    expect(markup).toContain('data-part="curve"');
    expect(markup).toContain('data-part="curve-path"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("-9.0 dB @ 3200 Hz");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="spectrum"');
    expect(markup).toContain("required");
  });

  test("hidden input value is valid JSON", () => {
    const markup = renderToStaticMarkup(
      <SpectrumAnalyzer.Root value={[-120, -45, 6]}>
        <SpectrumAnalyzer.HiddenInput name="spectrum" />
      </SpectrumAnalyzer.Root>,
    );
    const inputValue = markup.match(/value="([^"]+)"/)?.[1]?.replaceAll("&quot;", '"');

    expect(inputValue).toBeDefined();
    expect(JSON.parse(inputValue ?? "[]")).toEqual([
      { frequency: 20, magnitude: -90 },
      { frequency: expect.closeTo(632.455532, 5), magnitude: -45 },
      { frequency: 20000, magnitude: 0 },
    ]);
  });

  test("emits CSS variables and state data attributes", () => {
    const markup = renderToStaticMarkup(
      <SpectrumAnalyzer.Root
        disabled
        frequencyScale="linear"
        maxFrequency={24000}
        maxMagnitude={6}
        minFrequency={0}
        minMagnitude={-96}
        value={[
          { id: "low", frequency: -1, magnitude: -120 },
          { id: "clip", frequency: 1000, magnitude: 12 },
        ]}
      >
        <SpectrumAnalyzer.Graph>
          <SpectrumAnalyzer.Bars />
          <SpectrumAnalyzer.Curve />
        </SpectrumAnalyzer.Graph>
      </SpectrumAnalyzer.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-frequency-scale="linear"');
    expect(markup).toContain('data-out-of-range=""');
    expect(markup).toContain('data-clipped=""');
    expect(markup).toContain("--spectrum-analyzer-bin-count:2");
    expect(markup).toContain("--spectrum-analyzer-min-frequency:0");
    expect(markup).toContain('data-part="bars-path"');
  });

  test("supports empty data, render state, and render replacement", () => {
    const markup = renderToStaticMarkup(
      <SpectrumAnalyzer.Root value={[]}>
        {(state) => (
          <>
            <SpectrumAnalyzer.Graph
              render={(props) => <section {...props}>{props.children as ReactNode}</section>}
            >
              <SpectrumAnalyzer.Bars />
              <SpectrumAnalyzer.Curve />
            </SpectrumAnalyzer.Graph>
            <SpectrumAnalyzer.Value>{`${state.binCount} bins`}</SpectrumAnalyzer.Value>
          </>
        )}
      </SpectrumAnalyzer.Root>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain('data-empty=""');
    expect(markup).toContain('d=""');
    expect(markup).toContain(">0 bins</span>");
  });

  test("exports compound namespace and named parts", () => {
    expect(SpectrumAnalyzer.Root).toBe(SpectrumAnalyzerRoot);
    expect(SpectrumAnalyzer.Graph).toBe(SpectrumAnalyzerGraph);
    expect(SpectrumAnalyzer.Bars).toBe(SpectrumAnalyzerBars);
    expect(SpectrumAnalyzer.Curve).toBe(SpectrumAnalyzerCurve);
    expect(SpectrumAnalyzer.Value).toBe(SpectrumAnalyzerValue);
    expect(SpectrumAnalyzer.HiddenInput).toBe(SpectrumAnalyzerHiddenInput);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<SpectrumAnalyzer.Graph />)).toThrow(
      "SpectrumAnalyzer.Graph must be used inside SpectrumAnalyzer.Root.",
    );
  });
});
