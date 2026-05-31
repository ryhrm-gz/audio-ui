import { expect, test } from "vite-plus/test";
import {
  createToggleGroupState,
  getNextToggleGroupFocusedIndex,
  getNextToggleGroupValue,
  isToggleGroupItemPressed,
} from "./index.ts";

test("creates single toggle group state", () => {
  expect(createToggleGroupState("lowpass", { type: "single" })).toEqual({
    type: "single",
    value: "lowpass",
    values: ["lowpass"],
    orientation: "horizontal",
    allowEmpty: false,
  });
});

test("changes single selection and respects allowEmpty", () => {
  expect(getNextToggleGroupValue("lowpass", "highpass", { type: "single" })).toBe("highpass");
  expect(getNextToggleGroupValue("lowpass", "lowpass", { type: "single" })).toBe("lowpass");
  expect(getNextToggleGroupValue("lowpass", "lowpass", { allowEmpty: true, type: "single" })).toBe(
    "",
  );
});

test("adds and removes multiple values", () => {
  expect(getNextToggleGroupValue(["mute"], "solo", { type: "multiple" })).toEqual(["mute", "solo"]);
  expect(getNextToggleGroupValue(["mute", "solo"], "mute", { type: "multiple" })).toEqual(["solo"]);
});

test("does not change disabled items", () => {
  expect(getNextToggleGroupValue(["mute"], "solo", { disabled: true, type: "multiple" })).toEqual([
    "mute",
  ]);
});

test("checks pressed items", () => {
  expect(isToggleGroupItemPressed(["mute", "solo"], "solo", { type: "multiple" })).toBe(true);
  expect(isToggleGroupItemPressed("lowpass", "highpass", { type: "single" })).toBe(false);
});

test("navigates enabled items with keyboard commands", () => {
  const items = [{}, { disabled: true }, {}, {}];

  expect(getNextToggleGroupFocusedIndex(0, "ArrowRight", items)).toBe(2);
  expect(getNextToggleGroupFocusedIndex(2, "ArrowLeft", items)).toBe(0);
  expect(getNextToggleGroupFocusedIndex(0, "ArrowDown", items)).toBeUndefined();
  expect(getNextToggleGroupFocusedIndex(0, "ArrowDown", items, { orientation: "vertical" })).toBe(
    2,
  );
  expect(getNextToggleGroupFocusedIndex(2, "Home", items)).toBe(0);
  expect(getNextToggleGroupFocusedIndex(2, "End", items)).toBe(3);
});
