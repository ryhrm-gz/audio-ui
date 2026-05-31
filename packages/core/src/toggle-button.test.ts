import { expect, test } from "vite-plus/test";
import { createToggleButtonState, getNextToggleButtonPressed } from "./index.ts";

test("creates toggle button state", () => {
  expect(createToggleButtonState(true)).toEqual({
    pressed: true,
    mode: "toggle",
  });
  expect(createToggleButtonState(false, { mode: "momentary" })).toEqual({
    pressed: false,
    mode: "momentary",
  });
});

test("toggles pressed state", () => {
  expect(getNextToggleButtonPressed(false)).toBe(true);
  expect(getNextToggleButtonPressed(true)).toBe(false);
});

test("supports momentary press and release actions", () => {
  expect(getNextToggleButtonPressed(false, "press", { mode: "momentary" })).toBe(true);
  expect(getNextToggleButtonPressed(true, "release", { mode: "momentary" })).toBe(false);
});

test("preserves state when disabled", () => {
  expect(getNextToggleButtonPressed(false, "toggle", { disabled: true })).toBe(false);
  expect(getNextToggleButtonPressed(true, "release", { disabled: true })).toBe(true);
});
