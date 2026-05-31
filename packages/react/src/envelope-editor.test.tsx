import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  EnvelopeEditor,
  EnvelopeEditorGraph,
  EnvelopeEditorHiddenInput,
  EnvelopeEditorPoint,
  EnvelopeEditorPoints,
  EnvelopeEditorRoot,
  EnvelopeEditorSegment,
  EnvelopeEditorSegments,
  EnvelopeEditorValue,
} from "./index.ts";

describe("EnvelopeEditor", () => {
  test("renders root, graph, segments, points, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <EnvelopeEditor.Root
        defaultValue={{ attack: 0.02, decay: 0.18, sustain: 0.65, release: 0.4 }}
        maxTime={2}
        name="amp-envelope"
        required
        stepLevel={0.01}
        stepTime={0.01}
      >
        <EnvelopeEditor.Graph>
          <EnvelopeEditor.Segments />
          <EnvelopeEditor.Points />
        </EnvelopeEditor.Graph>
        <EnvelopeEditor.Value />
        <EnvelopeEditor.HiddenInput />
      </EnvelopeEditor.Root>,
    );

    expect(markup).toContain('data-audio-ui="envelope-editor"');
    expect(markup).toContain('data-part="graph"');
    expect(markup).toContain('data-part="segments"');
    expect(markup).toContain('data-part="segment"');
    expect(markup).toContain('data-phase="attack"');
    expect(markup).toContain('data-phase="release"');
    expect(markup).toContain('data-part="points"');
    expect(markup).toContain('data-part="point"');
    expect(markup).toContain('data-point="sustain"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-valuetext="sustain 0.65, decay 0.18s"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("A 0.02s / D 0.18s / S 0.65 / R 0.4s");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="amp-envelope"');
    expect(markup).toContain(
      'value="{&quot;attack&quot;:0.02,&quot;decay&quot;:0.18,&quot;sustain&quot;:0.65,&quot;release&quot;:0.4}"',
    );
  });

  test("emits CSS variables and state data attributes", () => {
    const markup = renderToStaticMarkup(
      <EnvelopeEditor.Root
        disabled
        readOnly
        value={{ attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3 }}
      >
        <EnvelopeEditor.Graph>
          <EnvelopeEditor.Segment phase="decay" />
          <EnvelopeEditor.Point point="sustain" aria-label="Sustain" />
        </EnvelopeEditor.Graph>
      </EnvelopeEditor.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain("--envelope-attack:0.1");
    expect(markup).toContain("--envelope-decay:0.2");
    expect(markup).toContain("--envelope-sustain:0.8");
    expect(markup).toContain("--envelope-release:0.3");
    expect(markup).toContain("--envelope-total-duration:0.6000000000000001");
    expect(markup).toContain("--envelope-point-x:");
    expect(markup).toContain("--envelope-segment-start-x:");
  });

  test("supports function children for custom segments and points", () => {
    const markup = renderToStaticMarkup(
      <EnvelopeEditor.Root value={{ attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 }}>
        <EnvelopeEditor.Graph>
          <EnvelopeEditor.Segments>
            {(segment) => <i data-custom-segment={segment.phase} />}
          </EnvelopeEditor.Segments>
          <EnvelopeEditor.Points>
            {(point) => <b data-custom-point={point.id}>{point.phase}</b>}
          </EnvelopeEditor.Points>
        </EnvelopeEditor.Graph>
      </EnvelopeEditor.Root>,
    );

    expect(markup).toContain('data-custom-segment="decay"');
    expect(markup).toContain('data-custom-point="sustain"');
    expect(markup).toContain(">sustain</b>");
  });

  test("passes render state to root children and value children", () => {
    const markup = renderToStaticMarkup(
      <EnvelopeEditor.Root value={{ attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 }}>
        {(state) => (
          <EnvelopeEditor.Value>{`duration ${state.totalDuration}`}</EnvelopeEditor.Value>
        )}
      </EnvelopeEditor.Root>,
    );

    expect(markup).toContain(">duration 0.6000000000000001</span>");
  });

  test("exports compound namespace and named parts", () => {
    expect(EnvelopeEditor.Root).toBe(EnvelopeEditorRoot);
    expect(EnvelopeEditor.Graph).toBe(EnvelopeEditorGraph);
    expect(EnvelopeEditor.Segments).toBe(EnvelopeEditorSegments);
    expect(EnvelopeEditor.Segment).toBe(EnvelopeEditorSegment);
    expect(EnvelopeEditor.Points).toBe(EnvelopeEditorPoints);
    expect(EnvelopeEditor.Point).toBe(EnvelopeEditorPoint);
    expect(EnvelopeEditor.Value).toBe(EnvelopeEditorValue);
    expect(EnvelopeEditor.HiddenInput).toBe(EnvelopeEditorHiddenInput);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() =>
      renderToStaticMarkup(
        <EnvelopeEditor.Graph>
          <span />
        </EnvelopeEditor.Graph>,
      ),
    ).toThrow("EnvelopeEditor.Graph must be used inside EnvelopeEditor.Root.");
  });

  test("supports render replacement", () => {
    const markup = renderToStaticMarkup(
      <EnvelopeEditor.Root value={{ attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 }}>
        <EnvelopeEditor.Graph
          render={(props) => <section {...props}>{props.children as ReactNode}</section>}
        />
      </EnvelopeEditor.Root>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain('data-part="graph"');
  });
});
