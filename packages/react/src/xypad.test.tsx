import type { MouseEvent, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { XYPad, XYPadArea, XYPadHiddenInput, XYPadRoot, XYPadThumb, XYPadValue } from "./index.ts";

describe("XYPad", () => {
  test("renders the root, area, thumb, value, and hidden input parts", () => {
    const markup = renderToStaticMarkup(
      <XYPad.Root
        defaultValue={{ x: 25, y: 75 }}
        maxX={50}
        maxY={100}
        minX={0}
        minY={-100}
        name="position"
        required
        stepX={5}
        stepY={25}
      >
        <XYPad.Area>
          <XYPad.Thumb aria-label="Position" />
        </XYPad.Area>
        <XYPad.Value format={(value) => `${value.x}, ${value.y}`} />
        <XYPad.HiddenInput />
      </XYPad.Root>,
    );

    expect(markup).toContain('data-audio-ui="xypad"');
    expect(markup).toContain('data-part="area"');
    expect(markup).toContain('data-part="thumb"');
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-roledescription="two-dimensional slider"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="50"');
    expect(markup).toContain('aria-valuenow="25"');
    expect(markup).toContain('aria-valuetext="x 25, y 75"');
    expect(markup).toContain('data-part="value"');
    expect(markup).toContain("25, 75");
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('name="position"');
    expect(markup).toContain('value="{&quot;x&quot;:25,&quot;y&quot;:75}"');
  });

  test("emits CSS variables and data attributes", () => {
    const markup = renderToStaticMarkup(
      <XYPad.Root disabled readOnly value={{ x: -50, y: 25 }} minX={-100} maxX={100}>
        <XYPad.Area>
          <XYPad.Thumb aria-label="Position" />
        </XYPad.Area>
        <XYPad.Value />
      </XYPad.Root>,
    );

    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-readonly="true"');
    expect(markup).toContain("--xypad-x:-50");
    expect(markup).toContain("--xypad-y:25");
    expect(markup).toContain("--xypad-x-percent:0.25");
    expect(markup).toContain("--xypad-y-percent:0.25");
  });

  test("passes render state to children", () => {
    const markup = renderToStaticMarkup(
      <XYPad.Root value={{ x: 10, y: 20 }} maxX={20} maxY={40}>
        {(state) => (
          <>
            <XYPad.Area>
              <XYPad.Thumb aria-label="Position" />
            </XYPad.Area>
            <XYPad.Value>{`${state.xPercent}, ${state.yPercent}`}</XYPad.Value>
          </>
        )}
      </XYPad.Root>,
    );

    expect(markup).toContain(">0.5, 0.5</span>");
  });

  test("resets to the default value on area double click", () => {
    const changes: Array<{ x: number; y: number }> = [];
    const commits: Array<{ x: number; y: number }> = [];
    let handleDoubleClick: ((event: MouseEvent<HTMLDivElement>) => void) | undefined;

    renderToStaticMarkup(
      <XYPad.Root
        value={{ x: 40, y: 40 }}
        defaultValue={{ x: 25, y: 75 }}
        onValueChange={(nextValue) => changes.push(nextValue)}
        onValueCommit={(nextValue) => commits.push(nextValue)}
      >
        <XYPad.Area
          render={(props) => {
            handleDoubleClick = props.onDoubleClick as typeof handleDoubleClick;
            return <div>{props.children as ReactNode}</div>;
          }}
        >
          <XYPad.Thumb />
        </XYPad.Area>
      </XYPad.Root>,
    );

    const event = createMouseEvent<HTMLDivElement>();
    handleDoubleClick?.(event);

    expect(changes).toEqual([{ x: 25, y: 75 }]);
    expect(commits).toEqual([{ x: 25, y: 75 }]);
    expect(event.defaultPrevented).toBe(true);
  });

  test("exports compound namespace and named parts", () => {
    expect(XYPad.Root).toBe(XYPadRoot);
    expect(XYPad.Area).toBe(XYPadArea);
    expect(XYPad.Thumb).toBe(XYPadThumb);
    expect(XYPad.Value).toBe(XYPadValue);
    expect(XYPad.HiddenInput).toBe(XYPadHiddenInput);
  });

  test("throws when a part is rendered outside the root", () => {
    expect(() => renderToStaticMarkup(<XYPad.Thumb />)).toThrow(
      "XYPad.Thumb must be used inside XYPad.Root.",
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
