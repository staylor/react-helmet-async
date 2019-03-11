import React from 'react';
import ReactServer from 'react-dom/server';
import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { render } from './utils';

Helmet.defaultProps.defer = false;

beforeAll(() => {
  Provider.canUseDOM = false;
});

afterAll(() => {
  Provider.canUseDOM = true;
});

describe('server', () => {
  describe('Declarative API', () => {
    it('renders body attributes as component', () => {
      const context = {};
      render(
        <Helmet>
          <body lang="ga" className="myClassName" />
        </Helmet>,
        context
      );

      const { bodyAttributes } = context.helmet;
      const attrs = bodyAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(<body lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders body attributes as string', () => {
      const context = {};
      render(
        <Helmet>
          <body lang="ga" className="myClassName" />
        </Helmet>,
        context
      );

      const body = context.helmet;

      expect(body.bodyAttributes).toBeDefined();
      expect(body.bodyAttributes.toString).toBeDefined();
      expect(body.bodyAttributes.toString()).toMatchSnapshot();
    });
  });
});
