# react-helmet-async

[![CircleCI](https://circleci.com/gh/staylor/react-helmet-async.svg?style=svg)](https://circleci.com/gh/staylor/react-helmet-async)

[Announcement post on Times Open blog](https://open.nytimes.com/the-future-of-meta-tag-management-for-modern-react-development-ec26a7dc9183)

This package is a fork of [React Helmet](https://github.com/nfl/react-helmet).
`<Helmet>` usage is synonymous, but server and client now requires `<HelmetProvider>` to encapsulate state per request.

`react-helmet` relies on `react-side-effect`, which is not thread-safe. If you are doing anything asynchronous on the server, you need Helmet to encapsulate data on a per-request basis, this package does just that.

## Usage

The main way that this package differs from `react-helmet` is that it requires using a Provider to encapsulate Helmet state for your React tree. If you use libraries like Redux or Apollo, you are already familiar with this paradigm:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet, { HelmetProvider } from 'react-helmet-async';

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
import Helmet, { HelmetProvider } from 'react-helmet-async';

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

## Usage with Next.js

To make this package work with next.js you've to do the following adjustements:

1. Create a _document.js in pages folder and put the following content:

```javascript
import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
    static async getInitialProps(ctx) {
        let helmetContext;
        
        const page = ctx.renderPage({
            enhanceApp: App => props => {
                const app = new App(props);
                helmetContext = app.helmetContext;
                return app;
            },
            enhancePage: Page => page
        });
        
        const documentProps = await Document.getInitialProps(ctx);

        return {
            ...documentProps,
            ...page,
            helmetContext
        };
    };

    render() {
        const { helmetContext } = this.props;

        return (
            <html lang="es" dir="ltr">
                <Head>
                    <meta
                        name="viewport"
                        content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height"
                    />
                    {helmetContext.helmet.meta.toComponent()}
                    {helmetContext.helmet.link.toComponent()}
                    {helmetContext.helmet.title.toComponent()}
                    {helmetContext.helmet.script.toComponent()}
                </Head>
                <body>
                    <noscript>
                        You need javascript to use this site.
                    </noscript>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
```

2. Create a _app.js in pages folder with the following content:

```javascript
import React from 'react';
import PropTypes from "prop-types";
import App, { Container } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';

export default class MainApp extends App {
    static displayName = "App";

    static async getInitialProps({ Component, ctx }) {
        // data fetching stuff
       return {};
    }

    constructor(props) {
        super(props);
        // You need to declare it!!!
        this.helmetContext = {};
    }
  
    render() {
        const { Component } = this.props
        
        return (
            <Container>
                {/** Then pass helmetContext to the Provider so you can use helmet on every child **/}
                <HelmetProvider context={this.helmetContext}>
                    <Component helmetContext={this.helmetContext} />
                </HelmetProvider>
            </Container>
        );
    }
}
```

This way you'll have `react-helmet-async` setup correctly in next.js

## Streams

This package only works with streaming if your `<head>` data is output outside of `renderToNodeStream()`.
This is possible if your data hydration method already parses your React tree. Example:

```javascript
import through from 'through';
import { renderToNodeStream } from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import Helmet, { HelmetProvider } from 'react-helmet-async';
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

## License

Licensed under the Apache 2.0 License, Copyright © 2018 Scott Taylor
