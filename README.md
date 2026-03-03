# react-helmet-async

[![CI](https://github.com/staylor/react-helmet-async/actions/workflows/ci.yml/badge.svg)](https://github.com/staylor/react-helmet-async/actions/workflows/ci.yml)

[Announcement post on Times Open blog](https://open.nytimes.com/the-future-of-meta-tag-management-for-modern-react-development-ec26a7dc9183)

This package is a fork of [React Helmet](https://github.com/nfl/react-helmet).
`<Helmet>` usage is synonymous, but server and client now requires `<HelmetProvider>` to encapsulate state per request.

`react-helmet` relies on `react-side-effect`, which is not thread-safe. If you are doing anything asynchronous on the server, you need Helmet to encapsulate data on a per-request basis, this package does just that.

## React 19

React 19 has built-in support for hoisting `<title>`, `<meta>`, `<link>`, `<style>`, and `<script>` elements to `<head>`. Starting with version 3.0.0, this package detects the React version at runtime:

- **React 19+**: `<Helmet>` renders actual DOM elements and lets React handle hoisting them to `<head>`. `<HelmetProvider>` becomes a transparent passthrough. The existing API is fully compatible — you do not need to change any code.
- **React 16–18**: The existing behavior is preserved. `<Helmet>` collects all instances, deduplicates tags, and applies changes to the DOM via manual manipulation (client) or serializes them for the response (server).

> **Note:** `htmlAttributes` and `bodyAttributes` do not have a React 19 equivalent, so they are still applied via direct DOM manipulation on both code paths.

If you are starting a new React 19 project and do not need `htmlAttributes`/`bodyAttributes`, SSR `context` serialization, `onChangeClientState`, `prioritizeSeoTags`, or `titleTemplate` support, you may not need this package at all — React 19's built-in metadata handling may be sufficient.

## Usage

**New in 1.0.0:** No more default export! `import { Helmet } from 'react-helmet-async'`

The main way that this package differs from `react-helmet` is that it requires using a Provider to encapsulate Helmet state for your React tree. If you use libraries like Redux or Apollo, you are already familiar with this paradigm:

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const app = (
  <HelmetProvider>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

createRoot(document.getElementById('app')).render(app);
```

On the server, we will no longer use static methods to extract state. `react-side-effect`
exposed a `.rewind()` method, which Helmet used when calling `Helmet.renderStatic()`. Instead, we are going
to pass a `context` prop to `HelmetProvider`, which will hold our state specific to each request.

```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const helmetContext = {};

const app = (
  <HelmetProvider context={helmetContext}>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

const html = renderToString(app);

const { helmet } = helmetContext;

// helmet.title.toString() etc…
```

> **React 19 SSR note:** When using React 19, `<title>`, `<meta>`, and `<link>` tags rendered inside `<Helmet>` are included directly in the React render output and hoisted to `<head>` by React itself. The `context` object will not be populated with helmet state on React 19. If you rely on the `context` for server rendering, you can render these tags directly in your component tree instead and let React 19 handle them natively.

## Streams

This package only works with streaming if your `<head>` data is output outside of `renderToNodeStream()`.
This is possible if your data hydration method already parses your React tree. Example:

```javascript
import through from 'through';
import { renderToNodeStream } from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import template from 'server/template';

const helmetContext = {};

const app = (
  <HelmetProvider context={helmetContext}>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

await getDataFromTree(app);

const [header, footer] = template({
  helmet: helmetContext.helmet,
});

res.status(200);
res.write(header);
renderToNodeStream(app)
  .pipe(
    through(
      function write(data) {
        this.queue(data);
      },
      function end() {
        this.queue(footer);
        this.queue(null);
      }
    )
  )
  .pipe(res);
```

> **React 19:** React 19's `renderToReadableStream` natively handles `<title>`, `<meta>`, and `<link>` hoisting during streaming, so the manual context extraction shown above is not necessary.

## Usage in Jest
While testing in using jest, if there is a need to emulate SSR, the following string is required to have the test behave the way they are expected to.

```javascript
import { HelmetProvider } from 'react-helmet-async';

HelmetProvider.canUseDOM = false;
```

> This is only relevant for React 16–18. On React 19, `HelmetProvider` is a passthrough and `canUseDOM` has no effect.

## Prioritizing tags for SEO

It is understood that in some cases for SEO, certain tags should appear earlier in the HEAD. Using the `prioritizeSeoTags` flag on any `<Helmet>` component allows the server render of react-helmet-async to expose a method for prioritizing relevant SEO tags.

In the component:
```javascript
<Helmet prioritizeSeoTags>
  <title>A fancy webpage</title>
  <link rel="notImportant" href="https://www.chipotle.com" />
  <meta name="whatever" value="notImportant" />
  <link rel="canonical" href="https://www.tacobell.com" />
  <meta property="og:title" content="A very important title"/>
</Helmet>
```

In your server template:

```javascript
<html>
  <head>
    ${helmet.title.toString()}
    ${helmet.priority.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.script.toString()}
  </head>
  ...
</html>
```

Will result in:

```html
<html>
  <head>
    <title>A fancy webpage</title>
    <meta property="og:title" content="A very important title"/>
    <link rel="canonical" href="https://www.tacobell.com" />
    <meta name="whatever" value="notImportant" />
    <link rel="notImportant" href="https://www.chipotle.com" />
  </head>
  ...
</html>
```

A list of prioritized tags and attributes can be found in [constants.ts](./src/constants.ts).

> **React 19:** The `prioritizeSeoTags` flag has no effect on React 19, since tags are rendered as regular JSX elements and their order in `<head>` is determined by React's rendering order.

## Usage without Context
You can optionally use `<Helmet>` outside a context by manually creating a stateful `HelmetData` instance, and passing that stateful object to each `<Helmet>` instance:


```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet, HelmetData } from 'react-helmet-async';

const helmetData = new HelmetData({});

const app = (
    <App>
      <Helmet helmetData={helmetData}>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
);

const html = renderToString(app);

const { helmet } = helmetData.context;
```

> **React 19:** The `helmetData` prop is ignored on React 19, since `<Helmet>` renders elements directly without the need for external state management.

## Compatibility

| React Version | Behavior |
|---|---|
| 16.6+ | Full support via `HelmetProvider` context and manual DOM updates |
| 17.x | Full support via `HelmetProvider` context and manual DOM updates |
| 18.x | Full support via `HelmetProvider` context and manual DOM updates |
| 19.x+ | Renders native JSX elements; React handles `<head>` hoisting |

## Development

```bash
pnpm install
pnpm test            # unit tests
pnpm run test:e2e    # server + browser e2e tests
pnpm run test:all    # everything
```

## License

Licensed under the Apache 2.0 License, Copyright © 2018 Scott Taylor
