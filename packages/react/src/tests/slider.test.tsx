import type { ComponentProps, KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  Slider,
  SliderHiddenInput,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "../index.ts";

describe("Slider", () => {
  test("renders the root, track, range, thumb, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root defaultValue={[25]} max={50} min={0} name="mix" required step={5}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Mix" />
        </Slider.Track>
        <Slider.Value
          index={0}
          format={(value) => (Array.isArray(value) ? value.join(" - ") : `${value}%`)}
        />
        <Slider.HiddenInput />
      </Slider.Root>,
    );

    expect(markup).toContain('data-audio-ui="slider"');
    expect(markup).toContain('data-thumb-count="1"');
    expect(markup).toContain('data-origin="left"');
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
    expect(markup).toContain('value="[25]"');
  });

  test("resets to the default value on track double click", () => {
    const changes: number[][] = [];
    const commits: number[][] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Slider.Root
        value={[40]}
        defaultValue={[25]}
        max={50}
        min={0}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Slider.Track
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <Slider.Thumb
            index={0}
            render={(props) => {
              expect(props.onDoubleClick).toBeUndefined();
              return <span />;
            }}
          />
        </Slider.Track>
      </Slider.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([[25]]);
    expect(commits).toEqual([[25]]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can disable track double click reset", () => {
    const changes: number[][] = [];
    const commits: number[][] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Slider.Root
        value={[40]}
        defaultValue={[25]}
        max={50}
        min={0}
        resetOnDoubleClick={false}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Slider.Track
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <Slider.Range />
          <Slider.Thumb index={0} />
        </Slider.Track>
      </Slider.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([]);
    expect(commits).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  test("renders center and right origin state for visual ranges", () => {
    const centerMarkup = renderToStaticMarkup(
      <Slider.Root defaultValue={[-25]} max={100} min={-100} origin="center">
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Pan" />
        </Slider.Track>
      </Slider.Root>,
    );
    const rightMarkup = renderToStaticMarkup(
      <Slider.Root defaultValue={[25]} origin="right">
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Trim" />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(centerMarkup).toContain('data-origin="center"');
    expect(centerMarkup).toContain("--slider-origin-percent:0.5");
    expect(centerMarkup).toContain("--slider-range-start-percent:0.375");
    expect(centerMarkup).toContain("--slider-range-end-percent:0.5");
    expect(centerMarkup).toContain("--slider-range-size-percent:0.125");
    expect(rightMarkup).toContain('data-origin="right"');
    expect(rightMarkup).toContain("--slider-origin-percent:1");
    expect(rightMarkup).toContain("--slider-range-start-percent:0.25");
    expect(rightMarkup).toContain("--slider-range-end-percent:1");
    expect(rightMarkup).toContain("--slider-range-size-percent:0.75");
  });

  test("renders range values with indexed thumbs, value labels, and hidden input", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root
        defaultValue={[20, 80]}
        max={100}
        min={0}
        minStepsBetweenThumbs={5}
        name="band"
        required
        step={1}
      >
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Minimum" />
          <Slider.Thumb index={1} aria-label="Maximum" />
        </Slider.Track>
        <Slider.Value />
        <Slider.Value index={0} />
        <Slider.Value index={1} />
        <Slider.HiddenInput />
      </Slider.Root>,
    );

    expect(markup).toContain('data-audio-ui="slider"');
    expect(markup).toContain('data-thumb-count="2"');
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

  test("exposes range CSS variables and state attributes", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root disabled inverted orientation="vertical" readOnly value={[25, 75]}>
        {(state) => (
          <>
            <Slider.Track>
              <Slider.Range />
              <Slider.Thumb index={0} aria-label="Minimum" />
              <Slider.Thumb index={1} aria-label="Maximum" />
            </Slider.Track>
            <Slider.Value>{state.rangeSizePercent}</Slider.Value>
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
    expect(markup).toContain("--slider-range-start-percent:0.25");
    expect(markup).toContain("--slider-range-end-percent:0.75");
    expect(markup).toContain("--slider-range-size-percent:0.5");
    expect(markup).toContain("--slider-thumb-percent:0.25");
    expect(markup).toContain("--slider-thumb-index:0");
    expect(markup).toContain(">0.5</span>");
  });

  test("handles controlled range keyboard changes and commits", () => {
    const changes: number[][] = [];
    const commits: number[][] = [];
    let handleKeyDown: ((event: KeyboardEvent<HTMLSpanElement>) => void) | undefined;

    renderToStaticMarkup(
      <Slider.Root
        value={[20, 80]}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Slider.Track>
          <Slider.Thumb
            index={0}
            render={(props) => {
              handleKeyDown = props.onKeyDown as typeof handleKeyDown;
              return <span>{props.children as ReactNode}</span>;
            }}
          />
          <Slider.Thumb index={1} />
        </Slider.Track>
      </Slider.Root>,
    );

    const event = createKeyboardEvent<HTMLSpanElement>("ArrowRight");
    handleKeyDown?.(event);

    expect(changes).toEqual([[21, 80]]);
    expect(commits).toEqual([[21, 80]]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can render named public range part exports through Slider", () => {
    const markup = renderToStaticMarkup(
      <SliderRoot defaultValue={[10, 90]}>
        <SliderTrack>
          <SliderRange />
          <SliderThumb index={0} aria-label="Minimum" />
          <SliderThumb index={1} aria-label="Maximum" />
        </SliderTrack>
        <SliderValue />
        <SliderHiddenInput name="range" />
      </SliderRoot>,
    );

    expect(markup).toContain('data-audio-ui="slider"');
    expect(markup).toContain('data-thumb-count="2"');
    expect(markup).toContain('value="[10,90]"');
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root disabled inverted orientation="vertical" readOnly value={[10]} max={20} min={0}>
        {(state) => (
          <>
            <Slider.Track>
              <Slider.Thumb index={0} aria-label="Level" />
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
      <Slider.Root defaultValue={[25]}>
        <Slider.Track>
          <Slider.Thumb index={0} aria-label="Mix" />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(markup).toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("can enable track click value changes", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root allowTrackClick defaultValue={[25]}>
        <Slider.Track>
          <Slider.Thumb index={0} aria-label="Mix" />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(markup).not.toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("disables range track click value changes by default", () => {
    const changes: number[][] = [];
    let handlePointerDown: ((event: PointerEvent<HTMLDivElement>) => void) | undefined;

    const markup = renderToStaticMarkup(
      <Slider.Root defaultValue={[20, 80]} onValueChange={(nextValue) => changes.push(nextValue)}>
        <Slider.Track
          render={(props) => {
            handlePointerDown = props.onPointerDown as typeof handlePointerDown;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Track>
      </Slider.Root>,
    );

    const event = createPointerEvent<HTMLDivElement>();
    handlePointerDown?.(event);

    expect(markup).toContain('data-track-click-disabled=""');
    expect(changes).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  test("can enable range track click value changes", () => {
    const markup = renderToStaticMarkup(
      <Slider.Root allowTrackClick defaultValue={[20, 80]}>
        <Slider.Track>
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(markup).not.toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Slider.Thumb index={0} />)).toThrow(
      "Slider.Thumb must be used inside Slider.Root.",
    );
  });

  test("throws when a thumb is rendered without an index", () => {
    expect(() =>
      renderToStaticMarkup(
        <Slider.Root defaultValue={[10, 90]}>
          <Slider.Thumb {...({} as ComponentProps<typeof Slider.Thumb>)} />
        </Slider.Root>,
      ),
    ).toThrow("Slider.Thumb requires an index.");
  });
});

function createMouseEvent<T>(): MouseEvent<T> {
  let defaultPrevented = false;

  return {
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as unknown as MouseEvent<T>;
}

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

function createPointerEvent<T>(): PointerEvent<T> {
  let defaultPrevented = false;

  return {
    button: 0,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
    target: {},
    currentTarget: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 20,
      }),
      setPointerCapture: () => {},
      hasPointerCapture: () => true,
      releasePointerCapture: () => {},
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  } as unknown as PointerEvent<T>;
}
