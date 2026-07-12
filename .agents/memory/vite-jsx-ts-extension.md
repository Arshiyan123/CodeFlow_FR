---
name: Vite/esbuild JSX requires .tsx extension
description: A TypeScript file containing JSX (e.g. a React context provider written as a .ts hook file) fails to build under Vite's esbuild transform with a cryptic "Expected '>' but found ..." parse error.
---

Any file that contains JSX syntax must use the `.tsx` extension, never `.ts` — even small "hook" files like `use-theme.ts` that just wrap a `Context.Provider`. esbuild parses `.ts` files without JSX support, so `<Foo.Provider value={...}>` inside a `.ts` file throws a parse error at the `value` token (looks unrelated to JSX at first glance).

**Why:** Design/implementation work sometimes names context-provider hook files `use-x.ts` by convention (matching sibling non-JSX hooks), forgetting the file itself returns JSX in its provider component.

**How to apply:** When a Vite build/dev-server error says "Expected '>' but found ..." pointing at a JSX-looking prop, check the failing file's extension first — rename `.ts` → `.tsx` before investigating further.
