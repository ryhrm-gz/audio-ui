import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  EQCurve,
  EQCurveBand,
  EQCurveBands,
  EQCurveCurve,
  EQCurveGraph,
  EQCurveGrid,
  EQCurveHiddenInput,
  EQCurveRoot,
  EQCurveValue,
} from "../index.ts";

const bands = [
  { id: "low", type: "low-shelf", frequency: 120, gain: 3, q: 0.7 },
  { id: "mid", type: "bell", frequency: 1000, gain: -4, q: 1.2 },
  { id: "cut", type: "low-pass", frequency: 12000, gain: 0, q: 0.9, enabled: false },
] as const;

describe("EQCurve", () => {
  test("renders root, graph, grid, curve, bands, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <EQCurve.Root defaultValue={[...bands]} name="eq" required curveResolution={8}>
        <EQCurve.Graph>
          <EQCurve.Grid />
          <EQCurve.Curve />
          <EQCurve.Bands>{(band) => <EQCurve.Band key={band.id} band={band} />}</EQCurve.Bands>
        </EQCurve.Graph>
        <EQCurve.Value />
        <EQCurve.HiddenInput />
      </EQCurve.Root>,
    );

    expect(markup).toContain('data-audio-ui="eq-curve"');
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain('data-part="grid"');
    expect(markup).toContain('data-part="curve"');
    expect(markup).toContain('data-part="curve-path"');
    expect(markup).toContain('data-part="bands"');
    expect(markup).toContain('data-part="band"');
    expect(markup).toContain('data-band-type="low-shelf"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-valuetext="120 Hz, 3 dB, Q 0.7"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain(">3 bands</span>");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="eq"');
  });

  test("hidden input value is valid JSON", () => {
    const markup = renderToStaticMarkup(
      <EQCurve.Root value={[...bands]}>
        <EQCurve.HiddenInput name="eq" />
      </EQCurve.Root>,
    );
    const inputValue = markup.match(/value="([^"]+)"/)?.[1]?.replaceAll("&quot;", '"');

    expect(inputValue).toBeDefined();
    expect(JSON.parse(inputValue ?? "[]")).toEqual([
      { id: "low", type: "low-shelf", frequency: 120, gain: 3, q: 0.7, enabled: true },
      { id: "mid", type: "bell", frequency: 1000, gain: -4, q: 1.2, enabled: true },
      { id: "cut", type: "low-pass", frequency: 12000, gain: 0, q: 0.9, enabled: false },
    ]);
  });

  test("emits CSS variables and state data attributes", () => {
    const markup = renderToStaticMarkup(
      <EQCurve.Root disabled readOnly value={[...bands]}>
        <EQCurve.Graph>
          <EQCurve.Grid />
          <EQCurve.Curve />
          <EQCurve.Band band="low" aria-label="Low band" />
        </EQCurve.Graph>
      </EQCurve.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain('data-enabled=""');
    expect(markup).toContain("--eq-curve-band-frequency:120");
    expect(markup).toContain("--eq-curve-band-gain:3");
    expect(markup).toContain("--eq-curve-band-q:0.7");
    expect(markup).toContain("--eq-curve-band-x:");
    expect(markup).toContain("--eq-curve-band-y:");
  });

  test("passes render state to root children and supports render replacement", () => {
    const markup = renderToStaticMarkup(
      <EQCurve.Root value={[...bands]}>
        {(state) => (
          <>
            <EQCurve.Graph
              render={(props) => <section {...props}>{props.children as ReactNode}</section>}
            >
              <EQCurve.Bands />
            </EQCurve.Graph>
            <EQCurve.Value>{`${state.bands.length} / ${state.curve.length}`}</EQCurve.Value>
          </>
        )}
      </EQCurve.Root>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain(">3 / 128</span>");
  });

  test("exports compound namespace and named parts", () => {
    expect(EQCurve.Root).toBe(EQCurveRoot);
    expect(EQCurve.Graph).toBe(EQCurveGraph);
    expect(EQCurve.Grid).toBe(EQCurveGrid);
    expect(EQCurve.Curve).toBe(EQCurveCurve);
    expect(EQCurve.Bands).toBe(EQCurveBands);
    expect(EQCurve.Band).toBe(EQCurveBand);
    expect(EQCurve.Value).toBe(EQCurveValue);
    expect(EQCurve.HiddenInput).toBe(EQCurveHiddenInput);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<EQCurve.Graph />)).toThrow(
      "EQCurve.Graph must be used inside EQCurve.Root.",
    );
  });
});
