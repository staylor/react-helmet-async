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
    it('renders script tags as React components', () => {
      const context = {};
      render(
        <Helmet
          script={[
            {
              src: 'http://localhost/test.js',
              type: 'text/javascript',
            },
            {
              src: 'http://localhost/test2.js',
              type: 'text/javascript',
            },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.script).toBeDefined();
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(2);

      scriptComponent.forEach(script => {
        expect(script).toEqual(expect.objectContaining({ type: 'script' }));
      });

      const markup = ReactServer.renderToStaticMarkup(scriptComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders script tags as string', () => {
      const context = {};
      render(
        <Helmet
          script={[
            {
              src: 'http://localhost/test.js',
              type: 'text/javascript',
            },
            {
              src: 'http://localhost/test2.js',
              type: 'text/javascript',
            },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders script tags as React components', () => {
      const context = {};
      render(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
          <script src="http://localhost/test2.js" type="text/javascript" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.script).toBeDefined();
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(2);

      scriptComponent.forEach(script => {
        expect(script).toEqual(expect.objectContaining({ type: 'script' }));
      });

      const markup = ReactServer.renderToStaticMarkup(scriptComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders script tags as string', () => {
      const context = {};
      render(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
          <script src="http://localhost/test2.js" type="text/javascript" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toMatchSnapshot();
    });
  });
});
