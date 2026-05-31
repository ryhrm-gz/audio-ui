import type { MouseEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Fader } from "../index.ts";

describe("Fader", () => {
  test("renders the root, track, range, thumb, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <Fader.Root defaultValue={-6} max={12} min={-60} name="channel-gain" required step={0.5}>
        <Fader.Track>
          <Fader.Range />
          <Fader.Thumb aria-label="Channel gain" />
        </Fader.Track>
        <Fader.Scale />
        <Fader.Value format={(value) => `${value} dB`} />
        <Fader.HiddenInput />
      </Fader.Root>,
    );

    expect(markup).toContain('data-audio-ui="fader"');
    expect(markup).toContain('data-orientation="vertical"');
    expect(markup).toContain('data-part="track"');
    expect(markup).toContain('data-part="range"');
    expect(markup).toContain('data-part="scale"');
    expect(markup).toContain('data-part="scale-mark"');
    expect(markup).toContain('data-unity=""');
    expect(markup).toContain('data-part="thumb"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-orientation="vertical"');
    expect(markup).toContain('aria-valuemin="-60"');
    expect(markup).toContain('aria-valuemax="12"');
    expect(markup).toContain('aria-valuenow="-6"');
    expect(markup).toContain('aria-valuetext="-6 dB"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("-6 dB");
    expect(markup).toContain("-inf");
    expect(markup).toContain("+12");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="channel-gain"');
    expect(markup).toContain('value="-6"');
  });

  test("resets to the default value on track double click", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Fader.Root
        value={6}
        defaultValue={-6}
        max={12}
        min={-60}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Fader.Track
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <Fader.Thumb
            render={(props) => {
              expect(props.onDoubleClick).toBeUndefined();
              return <span />;
            }}
          />
        </Fader.Track>
      </Fader.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([-6]);
    expect(commits).toEqual([-6]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can disable track double click reset", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Fader.Root
        value={6}
        defaultValue={-6}
        max={12}
        min={-60}
        resetOnDoubleClick={false}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Fader.Track
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <Fader.Range />
          <Fader.Thumb />
        </Fader.Track>
      </Fader.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([]);
    expect(commits).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <Fader.Root disabled inverted readOnly value={0}>
        {(state) => (
          <>
            <Fader.Track>
              <Fader.Thumb aria-label="Level" />
            </Fader.Track>
            <Fader.Value>
              {state.percent}:{state.gain}
            </Fader.Value>
          </>
        )}
      </Fader.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('data-inverted=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain('aria-orientation="vertical"');
    expect(markup).toContain(">0.78:1</span>");
  });

  test("supports custom fader scale labels", () => {
    const markup = renderToStaticMarkup(
      <Fader.Root
        defaultValue={0}
        scale={[
          { value: -60, percent: 0, label: "mute" },
          { value: 0, percent: 0.75, label: "unity" },
          { value: 12, percent: 1, label: "boost" },
        ]}
      >
        <Fader.Scale>{(mark) => mark.label}</Fader.Scale>
        <Fader.Track>
          <Fader.Thumb aria-label="Level" />
        </Fader.Track>
      </Fader.Root>,
    );

    expect(markup).toContain("mute");
    expect(markup).toContain("unity");
    expect(markup).toContain("boost");
  });

  test("disables track click value changes by default", () => {
    const markup = renderToStaticMarkup(
      <Fader.Root defaultValue={25}>
        <Fader.Track>
          <Fader.Thumb aria-label="Level" />
        </Fader.Track>
      </Fader.Root>,
    );

    expect(markup).toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("can enable track click value changes", () => {
    const markup = renderToStaticMarkup(
      <Fader.Root allowTrackClick defaultValue={25}>
        <Fader.Track>
          <Fader.Thumb aria-label="Level" />
        </Fader.Track>
      </Fader.Root>,
    );

    expect(markup).not.toContain('data-track-click-disabled=""');
    expect(markup).not.toContain("allowTrackClick");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Fader.Thumb />)).toThrow(
      "Fader.Thumb must be used inside Fader.Root.",
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
