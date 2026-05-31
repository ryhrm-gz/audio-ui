import type { KeyboardEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  RangeSlider,
  RangeSliderHiddenInput,
  RangeSliderRange,
  RangeSliderRoot,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderValue,
} from "./index.ts";

describe("RangeSlider", () => {
  test("renders root, track, range, thumbs, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <RangeSlider.Root
        defaultValue={[20, 80]}
        max={100}
        min={0}
        minStepsBetweenThumbs={5}
        name="band"
        required
        step={1}
      >
        <RangeSlider.Track>
          <RangeSlider.Range />
          <RangeSlider.Thumb index={0} aria-label="Minimum" />
          <RangeSlider.Thumb index={1} aria-label="Maximum" />
        </RangeSlider.Track>
        <RangeSlider.Value />
        <RangeSlider.Value index={0} />
        <RangeSlider.Value index={1} />
        <RangeSlider.HiddenInput />
      </RangeSlider.Root>,
    );

    expect(markup).toContain('data-audio-ui="range-slider"');
    expect(markup).toContain('data-part="root"');
    expect(markup).toContain('data-part="track"');
    expect(markup).toContain('data-part="range"');
    expect(markup.match(/role="slider"/g)).toHaveLength(2);
    expect(markup).toContain('aria-label="Minimum"');
    expect(markup).toContain('aria-label="Maximum"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="75"');
    expect(markup).toContain('aria-valuenow="20"');
    expect(markup).toContain('aria-valuemin="25"');
    expect(markup).toContain('aria-valuemax="100"');
    expect(markup).toContain('aria-valuenow="80"');
    expect(markup).toContain('data-thumb-index="0"');
    expect(markup).toContain('data-thumb-index="1"');
    expect(markup).toContain("20 - 80");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="band"');
    expect(markup).toContain('value="[20,80]"');
  });

  test("exposes CSS variables and state attributes", () => {
    const markup = renderToStaticMarkup(
      <RangeSlider.Root disabled inverted orientation="vertical" readOnly value={[25, 75]}>
        {(state) => (
          <>
            <RangeSlider.Track>
              <RangeSlider.Range />
              <RangeSlider.Thumb index={0} aria-label="Minimum" />
              <RangeSlider.Thumb index={1} aria-label="Maximum" />
            </RangeSlider.Track>
            <RangeSlider.Value>{state.sizePercent}</RangeSlider.Value>
          </>
        )}
      </RangeSlider.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('data-inverted=""');
    expect(markup).toContain('data-orientation="vertical"');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain('aria-orientation="vertical"');
    expect(markup).toContain("--range-slider-start-percent:0.25");
    expect(markup).toContain("--range-slider-end-percent:0.75");
    expect(markup).toContain("--range-slider-size-percent:0.5");
    expect(markup).toContain("--range-slider-thumb-percent:0.25");
    expect(markup).toContain("--range-slider-thumb-index:0");
    expect(markup).toContain(">0.5</span>");
  });

  test("handles controlled keyboard changes and commits", () => {
    const changes: number[][] = [];
    const commits: number[][] = [];
    let handleKeyDown: ((event: KeyboardEvent<HTMLSpanElement>) => void) | undefined;

    renderToStaticMarkup(
      <RangeSlider.Root
        value={[20, 80]}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <RangeSlider.Track>
          <RangeSlider.Thumb
            index={0}
            render={(props) => {
              handleKeyDown = props.onKeyDown as typeof handleKeyDown;
              return <span>{props.children as ReactNode}</span>;
            }}
          />
          <RangeSlider.Thumb index={1} />
        </RangeSlider.Track>
      </RangeSlider.Root>,
    );

    const event = createKeyboardEvent<HTMLSpanElement>("ArrowRight");
    handleKeyDown?.(event);

    expect(changes).toEqual([[21, 80]]);
    expect(commits).toEqual([[21, 80]]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can render named public part exports", () => {
    const markup = renderToStaticMarkup(
      <RangeSliderRoot defaultValue={[10, 90]}>
        <RangeSliderTrack>
          <RangeSliderRange />
          <RangeSliderThumb index={0} aria-label="Minimum" />
          <RangeSliderThumb index={1} aria-label="Maximum" />
        </RangeSliderTrack>
        <RangeSliderValue />
        <RangeSliderHiddenInput name="range" />
      </RangeSliderRoot>,
    );

    expect(markup).toContain('data-audio-ui="range-slider"');
    expect(markup).toContain('value="[10,90]"');
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<RangeSlider.Thumb index={0} />)).toThrow(
      "RangeSlider.Thumb must be used inside RangeSlider.Root.",
    );
  });
});

function createKeyboardEvent<T>(key: string): KeyboardEvent<T> {
  let defaultPrevented = false;

  return {
    key,
    shiftKey: false,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as unknown as KeyboardEvent<T>;
}
