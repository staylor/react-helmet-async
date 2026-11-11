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

On React 18, `<Helmet>` adds nothing to React's HTML output; it collects tags into `helmetContext`. To stream with [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream), write the `<head>` yourself in `onShellReady`, then call `pipe()`. At that point React hasn't written anything yet, and `helmetContext.helmet` holds the tags from every `<Helmet>` in the shell:

```javascript
import { createServer } from 'node:http';
import { PassThrough } from 'node:stream';

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const App = () => (
  <>
    <Helmet>
      <title>Hello World</title>
      <link rel="canonical" href="https://www.tacobell.com/" />
    </Helmet>
    <h1>Hello World</h1>
  </>
);

// Returns the HTML that goes before and after the app
const template = (helmet) => [
  `<!DOCTYPE html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="root">`,
  `</div>
  </body>
</html>`,
];

createServer((req, res) => {
  const helmetContext = {};

  const { pipe } = renderToPipeableStream(
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>,
    {
      onShellReady() {
        const [header, footer] = template(helmetContext.helmet);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.write(header);
        // pipe() ends its destination, so give it a PassThrough and end res yourself
        const body = new PassThrough();
        body.pipe(res, { end: false });
        body.on('end', () => res.end(footer));
        pipe(body);
      },
      onShellError() {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<h1>Something went wrong</h1>');
      },
    }
  );
}).listen(3000);
```

Write `base`, `style`, `script`, `noscript`, and `priority` (see [Prioritizing tags for SEO](#prioritizing-tags-for-seo)) into the template the same way if your `<Helmet>`s use them.

To hydrate the page, add your client bundle with the `bootstrapScripts` option, for example `bootstrapScripts: ['/client.js']` (the handler above renders the app for every URL, so serve that file separately), and call `hydrateRoot(document.getElementById('root'), <HelmetProvider><App /></HelmetProvider>)` in it.

`onShellReady` doesn't wait for `<Suspense>` boundaries that are still loading. A `<Helmet>` inside one renders after the head has gone out, so its tags are missing from the HTML. `<Helmet>` applies them in the browser once that boundary hydrates, but crawlers that don't run JavaScript never see them. If crawlers need those tags, keep that `<Helmet>` outside the boundary, or write the head in `onAllReady` instead, which fires once every boundary has resolved. The response then doesn't start until the whole page is ready, so you may want to do that only for crawlers. With the body of `onShellReady` moved into a `send()` function:

```javascript
const isCrawler = /bot|crawler|spider/i.test(req.headers['user-agent'] ?? '');

const { pipe } = renderToPipeableStream(app, {
  onShellReady() {
    if (!isCrawler) send();
  },
  onAllReady() {
    // Also fires after a shell error, once onShellError has responded
    if (isCrawler && !res.headersSent) send();
  },
  onShellError() {
    // Same as above
  },
});
```

`renderToNodeStream`, which this section used to show, is deprecated in React 18 and removed in React 19. React 18's version waits for every Suspense boundary before it writes anything, so to keep that behavior when you switch, write the head in `onAllReady` instead of `onShellReady`.

> **React 19:** `<HelmetProvider>` doesn't fill in `context` on React 19, so `helmetContext.helmet` stays `undefined` and the template above doesn't apply. React 19 hoists the `<title>`, `<meta>`, and `<link>` tags that `<Helmet>` renders into `<head>` itself, including when streaming with `renderToPipeableStream` or `renderToReadableStream`, so render the whole document, `<html>` included, and pipe it straight to the response. Tags inside a boundary that's still loading arrive later with that boundary's content, after `</head>`, so pipe in `onAllReady` if crawlers need them in `<head>`.

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
  <meta property="og:title" content="A very important title" />
</Helmet>
```

In your server template:

<!-- oxfmt-ignore -->
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
    <meta property="og:title" content="A very important title" />
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

| React Version | Behavior                                                         |
| ------------- | ---------------------------------------------------------------- |
| 16.6+         | Full support via `HelmetProvider` context and manual DOM updates |
| 17.x          | Full support via `HelmetProvider` context and manual DOM updates |
| 18.x          | Full support via `HelmetProvider` context and manual DOM updates |
| 19.x+         | Renders native JSX elements; React handles `<head>` hoisting     |

## Development

Use the Node.js version in `.nvmrc` (CI also runs 22 and 26) and the pnpm version in `packageManager`. Linting and formatting use [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) with [`@wonderboymusic/oxc-config`](https://github.com/staylor/oxc-config).

```bash
pnpm install
pnpm lint            # oxlint + oxfmt --check
pnpm lint-fix        # apply lint fixes and formatting
pnpm test            # unit tests
pnpm run test:e2e    # server + browser e2e tests
pnpm run test:all    # everything
```

## License

Licensed under the Apache 2.0 License, Copyright © 2018 Scott Taylor
