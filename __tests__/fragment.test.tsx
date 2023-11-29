import React from 'react';

import { Helmet } from '../src';

import { render } from './utils';

// TODO: This is confusing
Helmet.defaultProps.defer = false;

describe('fragments', () => {
  it('parses Fragments', () => {
    const title = 'Hello';
    render(
      <Helmet>
        <>
          <title>{title}</title>
          <meta charSet="utf-8" />
        </>
      </Helmet>
    );

    expect(document.title).toBe(title);
  });

  it('parses nested Fragments', () => {
    const title = 'Baz';
    render(
      <Helmet>
        <>
          <title>Foo</title>
          <>
            <title>Bar</title>
            <title>{title}</title>
          </>
        </>
      </Helmet>
    );

    expect(document.title).toBe(title);
  });
});
