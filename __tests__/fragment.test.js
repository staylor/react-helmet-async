import React, { Fragment } from 'react';
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
        <Fragment>
          <title>Hello</title>
        </Fragment>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });

  it('parses nested Fragments', () => {
    render(
      <Helmet>
        <Fragment>
          <title>Foo</title>
          <Fragment>
            <title>Bar</title>
            <Fragment>
              <title>Baz</title>
            </Fragment>
          </Fragment>
        </Fragment>
      </Helmet>
    );

    expect(document.title).toMatchSnapshot();
  });
});
