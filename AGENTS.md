<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Component Structure

- Keep primitive implementations split by component name. Framework-agnostic logic belongs under `packages/core/src/<component>/`, and React bindings belong under `packages/react/src/<component>/`.
- Avoid placing a full primitive in one large file. Separate core concerns such as types, options, value math, angle math, keyboard behavior, drag behavior, and state construction. Separate React concerns such as context, render helpers, ref helpers, and each public part component.
- Preserve the public package API through `src/index.ts` re-exports when moving files, so consumers can keep importing the same component names.
- Add tests where behavior is stable and cheap to cover. Prefer pure function tests for `core`, and use `react-dom/server` structural tests for React parts unless a browser-like DOM is necessary.
- Do not add extra test dependencies when Vite+ already provides the needed Vitest runner. Import test helpers from `vite-plus/test`, and avoid deprecated React test APIs; use modern React exports such as `act` from `react` if interaction tests need it.
