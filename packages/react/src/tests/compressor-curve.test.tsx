import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  CompressorCurve,
  CompressorCurveCurve,
  CompressorCurveGraph,
  CompressorCurveGrid,
  CompressorCurveHiddenInput,
  CompressorCurveRoot,
  CompressorCurveValue,
} from "../index.ts";

const value = {
  threshold: -24,
  ratio: 4,
  knee: 8,
  makeupGain: 3,
} as const;

describe("CompressorCurve", () => {
  test("renders root, graph, grid, curve, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <CompressorCurve.Root defaultValue={value} name="compressor" required>
        <CompressorCurve.Graph>
          <CompressorCurve.Grid />
          <CompressorCurve.Curve />
        </CompressorCurve.Graph>
        <CompressorCurve.Value />
        <CompressorCurve.HiddenInput />
      </CompressorCurve.Root>,
    );

    expect(markup).toContain('data-audio-ui="compressor-curve"');
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain('data-part="grid"');
    expect(markup).toContain('data-part="curve"');
    expect(markup).toContain('data-part="curve-path"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain(">-24 dB, 4:1, knee 8 dB, makeup 3 dB</span>");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="compressor"');
  });

  test("hidden input value is valid JSON", () => {
    const markup = renderToStaticMarkup(
      <CompressorCurve.Root value={value}>
        <CompressorCurve.HiddenInput name="compressor" />
      </CompressorCurve.Root>,
    );
    const inputValue = markup.match(/value="([^"]+)"/)?.[1]?.replaceAll("&quot;", '"');

    expect(inputValue).toBeDefined();
    expect(JSON.parse(inputValue ?? "{}")).toEqual(value);
  });

  test("emits CSS variables and state data attributes", () => {
    const markup = renderToStaticMarkup(
      <CompressorCurve.Root disabled value={value}>
        <CompressorCurve.Graph>
          <CompressorCurve.Grid />
          <CompressorCurve.Curve />
        </CompressorCurve.Graph>
      </CompressorCurve.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain("--compressor-curve-threshold:-24");
    expect(markup).toContain("--compressor-curve-ratio:4");
    expect(markup).toContain("--compressor-curve-knee:8");
    expect(markup).toContain("--compressor-curve-makeup-gain:3");
  });

  test("passes render state to root children and supports render replacement", () => {
    const markup = renderToStaticMarkup(
      <CompressorCurve.Root value={value} curveResolution={16}>
        {(state) => (
          <>
            <CompressorCurve.Graph
              render={(props) => <section {...props}>{props.children as ReactNode}</section>}
            >
              <CompressorCurve.Curve />
            </CompressorCurve.Graph>
            <CompressorCurve.Value>{`${state.value.ratio} / ${state.curve.length}`}</CompressorCurve.Value>
          </>
        )}
      </CompressorCurve.Root>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain(">4 / 16</span>");
  });

  test("exports compound namespace and named parts", () => {
    expect(CompressorCurve.Root).toBe(CompressorCurveRoot);
    expect(CompressorCurve.Graph).toBe(CompressorCurveGraph);
    expect(CompressorCurve.Grid).toBe(CompressorCurveGrid);
    expect(CompressorCurve.Curve).toBe(CompressorCurveCurve);
    expect(CompressorCurve.Value).toBe(CompressorCurveValue);
    expect(CompressorCurve.HiddenInput).toBe(CompressorCurveHiddenInput);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<CompressorCurve.Graph />)).toThrow(
      "CompressorCurve.Graph must be used inside CompressorCurve.Root.",
    );
  });
});
