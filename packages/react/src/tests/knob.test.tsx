import type { MouseEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Knob } from "../index.ts";

describe("Knob", () => {
  test("renders the root, control, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root defaultValue={25} max={50} min={0} name="gain" required step={5}>
        <Knob.Control aria-label="Gain" />
        <Knob.Value format={(value) => `${value} dB`} />
        <Knob.HiddenInput />
      </Knob.Root>,
    );

    expect(markup).toContain('data-audio-ui="knob"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="50"');
    expect(markup).toContain('aria-valuenow="25"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("25 dB");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="gain"');
    expect(markup).toContain('value="25"');
  });

  test("resets to the default value on control double click", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Knob.Root
        value={40}
        defaultValue={25}
        max={50}
        min={0}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Knob.Control
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div />;
          }}
        />
      </Knob.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([25]);
    expect(commits).toEqual([25]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("can disable control double click reset", () => {
    const changes: number[] = [];
    const commits: number[] = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <Knob.Root
        value={40}
        defaultValue={25}
        max={50}
        min={0}
        resetOnDoubleClick={false}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <Knob.Control
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div />;
          }}
        />
      </Knob.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([]);
    expect(commits).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root disabled readOnly value={10} max={20} min={0}>
        {(state) => (
          <>
            <Knob.Control aria-label="Ratio" />
            <Knob.Value>{state.percent}</Knob.Value>
          </>
        )}
      </Knob.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain(">0.5</span>");
  });

  test("renders custom knob marks and generated ticks", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root defaultValue={0} max={12} min={-60}>
        <Knob.Scale>
          <Knob.Ticks count={3} />
          <Knob.Mark value={-60}>-inf</Knob.Mark>
          <Knob.Mark value={0}>
            <span data-icon="unity" />
          </Knob.Mark>
          <Knob.Mark value={12}>+12</Knob.Mark>
        </Knob.Scale>
        <Knob.Control aria-label="Gain" />
      </Knob.Root>,
    );

    expect(markup).toContain('data-part="scale"');
    expect(markup).toContain('data-part="ticks"');
    expect(markup).toContain('data-part="tick"');
    expect(markup).toContain('data-part="mark"');
    expect(markup).toContain("--knob-mark-value:-60");
    expect(markup).toContain("--knob-mark-percent:0");
    expect(markup).toContain("--knob-mark-angle:-135deg");
    expect(markup).toContain("--knob-mark-angle-inverse:135deg");
    expect(markup).toContain("--knob-mark-x:-0.707");
    expect(markup).toContain("--knob-mark-y:0.707");
    expect(markup).toContain("-inf");
    expect(markup).toContain('data-icon="unity"');
    expect(markup).toContain("+12");
  });

  test("passes resolved mark and tick positions to function children", () => {
    const markup = renderToStaticMarkup(
      <Knob.Root defaultValue={0} max={100} min={0}>
        <Knob.Scale>
          <Knob.Ticks count={2}>{(tick) => `${tick.value}:${tick.angle}`}</Knob.Ticks>
          <Knob.Mark value={50}>{(mark, state) => `${mark.percent}:${state.value}`}</Knob.Mark>
        </Knob.Scale>
      </Knob.Root>,
    );

    expect(markup).toContain(">0:-135</span>");
    expect(markup).toContain(">100:135</span>");
    expect(markup).toContain(">0.5:0</span>");
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<Knob.Control />)).toThrow(
      "Knob.Control must be used inside Knob.Root.",
    );
    expect(() => renderToStaticMarkup(<Knob.Scale />)).toThrow(
      "Knob.Scale must be used inside Knob.Root.",
    );
    expect(() => renderToStaticMarkup(<Knob.Mark value={0} />)).toThrow(
      "Knob.Mark must be used inside Knob.Root.",
    );
    expect(() => renderToStaticMarkup(<Knob.Ticks count={1} />)).toThrow(
      "Knob.Ticks must be used inside Knob.Root.",
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
