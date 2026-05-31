import type { MouseEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Slider } from "../index.ts";

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
    expect(markup).toContain('value="25"');
  });

  test("resets to the default value on track double click", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Slider.Root
        value={40}
        defaultValue={25}
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

    expect(changes).toEqual([25]);
    expect(commits).toEqual([25]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can disable track double click reset", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Slider.Root
        value={40}
        defaultValue={25}
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
          <Slider.Thumb />
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
      <Slider.Root defaultValue={-25} max={100} min={-100} origin="center">
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb aria-label="Pan" />
        </Slider.Track>
      </Slider.Root>,
    );
    const rightMarkup = renderToStaticMarkup(
      <Slider.Root defaultValue={25} origin="right">
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb aria-label="Trim" />
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
