# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Dates are npm publish dates (UTC).

## [Unreleased]

### Added

- `react-helmet-async/package.json` resolves again. The `exports` map added in 3.0.0 had left it out.

### Changed

- On React 19, mounted `<Helmet>` instances are merged again, as on React 16–18: the innermost `<title>` wins and uses the nearest `titleTemplate` and `defaultTitle`, and a tag that several `<Helmet>`s set, such as `<meta name="description">`, renders once, from the innermost one. Server rendering still outputs every `<Helmet>`'s tags, because instances only merge once they mount, and when hydrating React reuses only the first server-rendered `<title>`, so a second one stays in `<head>`.
- With `prioritizeSeoTags`, `<meta charset>` moves from `helmet.meta` to the start of `helmet.priority`, because browsers only honor a charset declared within the first 1024 bytes of the document. A template that prints `helmet.meta` but not `helmet.priority` no longer outputs it.
- The errors `<Helmet>` throws for invalid children or a missing `<HelmetProvider>` are plain `Error`s, named `Error` instead of `Invariant Violation`.

### Removed

- The `invariant` and `shallowequal` dependencies.

### Fixed

- On React 16–18, a `<Helmet>` with no `<HelmetProvider>` above it and no `helmetData` prop throws `<Helmet> must be rendered inside a <HelmetProvider> or be given a helmetData prop. If it is, check that only one copy of react-helmet-async is bundled.` instead of `TypeError: Cannot read properties of undefined (reading 'add')`.
- On React 16–18, entries in the `meta`, `link`, `script`, `style` and `noscript` props that use React attribute names such as `itemProp`, `charSet` or `httpEquiv` are no longer dropped. Their React names are written as HTML attribute names, as for JSX children, so `httpEquiv` becomes `http-equiv` and `className` becomes `class` in the DOM and in `toString()`.
- `<link>`, `<meta>`, `<noscript>`, `<script>` and `<style>` tags inside a fragment are no longer dropped when `<Helmet>` has more than one fragment, or a fragment next to a tag of the same type.
- On React 16–18, function props such as `onLoad` are attached as event handlers instead of being written as attributes that contain the function's source, and `toString()` leaves them out. Handlers receive the native `Event`, not a React synthetic event.
- `lib/index.js` and `lib/index.esm.js` are compiled to ES2018, so webpack 4, which Create React App 3 and 4 use, can parse them. Since 2.0.0 they contained class fields and optional chaining.
- On React 16–18 with `defer` on (the default), changes made while the tab is in the background are applied within about a second instead of when the tab is shown again.
- A `<base>` with only a `target` attribute is no longer dropped. The HTML spec allows `href`, `target`, or both.

## [3.0.0] - 2026-03-03

### Added

- React 19 support. The `react` peer dependency range is now `^16.6.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`. When `React.version` is 19 or later, `<Helmet>` renders `<title>`, `<meta>`, `<link>`, `<base>`, `<script>`, `<style>` and `<noscript>` as React elements and leaves their placement to React. React 16–18 keep the 2.x behavior.
- An `exports` map in `package.json`: `import` resolves to `lib/index.esm.js` and `require` to `lib/index.js`.

### Changed

- **Breaking:** on React 19, `<Helmet>` and `<HelmetProvider>` no longer collect state or manage `<head>` themselves:
  - `<HelmetProvider>` only renders its children. Its `context` object is never filled in, so server code that reads `helmetContext.helmet` gets `undefined`. The `helmetData` prop is ignored too, and `helmetData.context.helmet` keeps its initial empty value.
  - `htmlAttributes` and `bodyAttributes` are applied to the DOM after mount, so server-rendered HTML doesn't include them.
  - `onChangeClientState` is never called.
  - `prioritizeSeoTags` has no effect.
  - `<Helmet>` instances are no longer merged or deduplicated against each other. Nested `<Helmet>`s that each set a title, a `<meta name="description">` or a canonical `<link>` render two of each. Only React's own resource deduplication applies: it drops repeated `async` scripts with the same `src` and stylesheets with the same `href` and `precedence`.
  - `titleTemplate` and `defaultTitle` only apply to the `<Helmet>` that sets them. An app-level `<Helmet titleTemplate="%s | Site" defaultTitle="Site" />` plus a page-level `<Helmet title="About" />` renders `<title>Site</title>` and `<title>About</title>` instead of `About | Site`.
  - React hoists `<title>`, `<meta>` and `<link>` tags into `<head>`, or to the start of the output when it renders only part of the page. `<base>`, `<noscript>` and `<meta itemprop>` tags are rendered where the `<Helmet>` is, and so are `<script>`, `<style>` and stylesheet `<link>` tags unless they use React 19's opt-ins: `async` and `src` on scripts, `precedence` on stylesheets, `href` and `precedence` on styles.
- **Breaking:** the `exports` map exposes only the package root. Deep imports such as `react-helmet-async/lib/index.js` or `react-helmet-async/package.json` no longer resolve in Node.js (`ERR_PACKAGE_PATH_NOT_EXPORTED`) or in bundlers that honor `exports`.
- **Breaking:** native Node.js ESM (`import` without a bundler) now loads `lib/index.esm.js` instead of the CommonJS build. Imports of the package root through `require()` or a bundler are unaffected.
  - The package has no `"type": "module"`, so Node.js runs that file as ESM only through module syntax detection, which is on by default from Node.js 20.19 and 22.7. On older versions every `import` of the package throws a `SyntaxError`. The package still declares no `engines` field.
  - On those newer versions, named imports such as `import { Helmet } from 'react-helmet-async'` work again; they failed in 2.x. The ESM build has no default export, though, so the 2.x workaround `import pkg from 'react-helmet-async'` throws on every Node.js version, and TypeScript doesn't catch it.
- **Breaking (TypeScript):** `HelmetDatum.toComponent()` returns `React.ReactElement[]` instead of `React.Component<any>`, so the server state's `toComponent()` results can be rendered in JSX without a cast.
- **Breaking (TypeScript):** `HelmetData#context.helmet` is typed `HelmetServerState | null`. It becomes `null` after a client-side render.
- **Breaking (TypeScript):** `Helmet`'s internal methods, such as `mapChildrenToProps`, are `private`.

### Removed

- **Breaking (TypeScript):** `HelmetServerState.titleAttributes`. It was never set at runtime; title attributes are rendered as part of `helmet.title`.
- **Breaking (TypeScript):** the `MappedServerState` type export.

### Fixed

- `helmet.priority.toComponent()` returns an empty array instead of `undefined` when `prioritizeSeoTags` is off.
- The type declarations type-check against `@types/react` 19 without `skipLibCheck`. The 2.x declarations used the global `JSX` namespace, which `@types/react` 19 removed.

## [2.0.5] - 2024-05-07

### Removed

- `react-dom` from `peerDependencies`.

## [2.0.4] - 2023-12-18

### Fixed

- The `HelmetProvider` constructor's props type includes `children`.

## [2.0.3] - 2023-12-01

No changes. The published files are identical to 2.0.2 apart from the version number.

## [2.0.2] - 2023-12-01

### Fixed

- `<HelmetProvider>`'s `context` prop accepts an object without `helmet`, such as `{}`, in the type declarations.

## [2.0.1] - 2023-11-21

### Changed

- `HelmetProvider.canUseDOM` requires `window.document.createElement` to exist, instead of only a global `document`.

### Fixed

- `<HelmetProvider>`'s `context` prop is optional again in the type declarations.

## [2.0.0] - 2023-11-20

The package was rewritten in TypeScript and is built with esbuild instead of Babel and microbundle. It still declares no `engines` field; the `.nvmrc` bump to Node.js 18.17.1 only applies to developing this repository.

### Added

- Type exports `Attributes`, `MappedServerState`, `StateUpdate`, `TagList` and `TitleProps`.
- `"sideEffects": false` in `package.json`.

### Changed

- **Breaking:** `lib/index.js` (CommonJS) and `lib/index.esm.js` (ES modules) are no longer compiled to ES5. They contain ES2022 syntax such as class fields, optional chaining and object spread. Loading them needs Node.js 14 or later (1.3.0 ran on Node.js 12), and projects that target older browsers, or use tools that can't parse that syntax, need to transpile the package.
- **Breaking:** the ES module build moved from `lib/index.module.js` to `lib/index.esm.js`, and `src/` and the root `index.d.ts` are no longer published. Deep imports of those paths break.
- **Breaking:** native Node.js ESM can no longer use named imports. `import { Helmet } from 'react-helmet-async'` throws `SyntaxError: Named export 'Helmet' not found`, because Node.js can't see the CommonJS build's named exports. Use `import pkg from 'react-helmet-async'` or `require()` instead. Bundlers are unaffected.
- **Breaking (TypeScript):** the type declarations are generated from the source instead of the hand-written `index.d.ts`, and some are stricter:
  - `base`, `titleAttributes`, `script`, `style` and `noscript` take `Attributes` (`{ [key: string]: string }`) instead of `any` or `Object`, so non-string values such as `script={[{ src, async: true }]}` no longer type-check.
  - `<HelmetProvider>` requires a `context` prop that contains `helmet`. 2.0.1 and 2.0.2 relax this again.
- `prioritizeSeoTags` also moves `<meta name="generator">` into `helmet.priority`.

### Removed

- **Breaking:** the UMD build (`lib/index.umd.js` and the `umd:main` field) and `lib/index.modern.js`.
- **Breaking (TypeScript):** the `FilledContext`, `ProviderProps` and `OtherElementAttributes` type exports.
- Runtime prop validation: `Helmet` and `HelmetProvider` no longer have `propTypes`, and `prop-types` and `@babel/runtime` are no longer dependencies.

## 1.x and earlier

See the [git history up to 1.3.0](https://github.com/staylor/react-helmet-async/commits/b1ee65880e71df9124c4e01d07c086d8ce2fc63a).

[Unreleased]: https://github.com/staylor/react-helmet-async/compare/ba5d5fb820750dcf29c9621e9feafe2b8388d60b...HEAD
[3.0.0]: https://github.com/staylor/react-helmet-async/compare/5f4da3896c8b70bedcd3c05d406ff5241601933c...ba5d5fb820750dcf29c9621e9feafe2b8388d60b
[2.0.5]: https://github.com/staylor/react-helmet-async/compare/6a37f732662d7f73d868f7d83ba61465a3905cb2...5f4da3896c8b70bedcd3c05d406ff5241601933c
[2.0.4]: https://github.com/staylor/react-helmet-async/compare/a35751fc140895f3fccb9ba2d9c549c648160898...6a37f732662d7f73d868f7d83ba61465a3905cb2
[2.0.3]: https://github.com/staylor/react-helmet-async/compare/4083e9b382ec4c66044151177af70ea09f671767...a35751fc140895f3fccb9ba2d9c549c648160898
[2.0.2]: https://github.com/staylor/react-helmet-async/compare/b903f505f502cf165ec20ccd8f24ba01df14eafe...4083e9b382ec4c66044151177af70ea09f671767
[2.0.1]: https://github.com/staylor/react-helmet-async/compare/9c1cc27d04e508ee28b026094caf6181316262c1...b903f505f502cf165ec20ccd8f24ba01df14eafe
[2.0.0]: https://github.com/staylor/react-helmet-async/compare/b1ee65880e71df9124c4e01d07c086d8ce2fc63a...9c1cc27d04e508ee28b026094caf6181316262c1
