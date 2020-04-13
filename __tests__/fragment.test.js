import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from '../src';
import Provider from '../src/Provider';

Helmet.defaultProps.defer = false;

const mount = document.getElementById('mount');

const render = node => {
  ReactDOM.render(<Provider>{node}</Provider>, mount);
};

describe('fragments', () => {
  it('parses Fragments', () => {
    render(
      <Helmet>
        <>
          <title>Hello</title>
          <meta charSet="utf-8" />
        </>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });

  it('parses nested Fragments', () => {
    render(
      <Helmet>
        <>
          <title>Foo</title>
          <>
            <title>Bar</title>
            <title>Baz</title>
          </>
        </>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });
});
