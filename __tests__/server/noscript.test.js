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

const isArray = {
  asymmetricMatch: actual => Array.isArray(actual),
};

describe('server', () => {
  describe('API', () => {
    it('renders noscript tags as React components', () => {
      const context = {};
      render(
        <Helmet
          noscript={[
            {
              id: 'foo',
              innerHTML: '<link rel="stylesheet" type="text/css" href="/style.css" />',
            },
            {
              id: 'bar',
              innerHTML: '<link rel="stylesheet" type="text/css" href="/style2.css" />',
            },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toEqual(isArray);
      expect(noscriptComponent).toHaveLength(2);

      noscriptComponent.forEach(noscript => {
        expect(noscript).toEqual(expect.objectContaining({ type: 'noscript' }));
      });

      const markup = ReactServer.renderToStaticMarkup(noscriptComponent);

      expect(markup).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders noscript tags as React components', () => {
      const context = {};
      render(
        <Helmet>
          <noscript id="foo">{`<link rel="stylesheet" type="text/css" href="/style.css" />`}</noscript>
          <noscript id="bar">{`<link rel="stylesheet" type="text/css" href="/style2.css" />`}</noscript>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toEqual(isArray);
      expect(noscriptComponent).toHaveLength(2);

      noscriptComponent.forEach(noscript => {
        expect(noscript).toEqual(expect.objectContaining({ type: 'noscript' }));
      });

      const markup = ReactServer.renderToStaticMarkup(noscriptComponent);

      expect(markup).toMatchSnapshot();
    });
  });
});
