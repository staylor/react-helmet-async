# react-helmet-async

[![CircleCI](https://circleci.com/gh/staylor/react-helmet-async.svg?style=svg)](https://circleci.com/gh/staylor/react-helmet-async)

[Announcement post on Times Open blog](https://open.nytimes.com/the-future-of-meta-tag-management-for-modern-react-development-ec26a7dc9183)

This package is a fork of [React Helmet](https://github.com/nfl/react-helmet).
`<Helmet>` usage is synonymous, but server and client now requires `<HelmetProvider>` to encapsulate state per request.

`react-helmet` relies on `react-side-effect`, which is not thread-safe. If you are doing anything asynchronous on the server, you need Helmet to encapsulate data on a per-request basis, this package does just that.

## Usage

**New is 1.0.0:** No more default export! `import { Helmet } from 'react-helmet-async'`

The main way that this package differs from `react-helmet` is that it requires using a Provider to encapsulate Helmet state for your React tree. If you use libraries like Redux or Apollo, you are already familiar with this paradigm:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.hydrate(
  app,
  document.getElementById(‘app’)
);
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

## Support for iframe portals

Supports usage of React Helmet inside an iframe via react portals or a library like [react-frame-component](https://github.com/ryanseddon/react-frame-component) by providing a prop to pass the document element of the iframe.

For example in the following code the `<meta>` tag would be placed inside the iframe instead of the main page.

```html
<body>
  <iframe id="iframe-target"></iframe>
  <div id="app"></div>
</body>
```

```jsx
const iframeElement = document.getElementById('iframe-target');
ReactDOM.render(
  <Provider document={iframeElement.contentDocument}>
    <div>
      {ReactDOM.createPortal(
        <Helmet
          meta={[
            {
              name: 'description',
              content: 'a description tag',
            },
          ]}
        />,
        iframeElement
      )}
    </div>
  </Provider>,
  document.getElementById('app')
);
```

## Usage in Jest

While testing in using jest, if there is a need to emulate SSR, the following string is required to have the test behave the way they are expected to.

```javascript
import { HelmetProvider } from 'react-helmet-async';

HelmetProvider.canUseDOM = false;
```

## License

Licensed under the Apache 2.0 License, Copyright © 2018 Scott Taylor
