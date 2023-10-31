import React from 'react';
import ReactServer from 'react-dom/server';

import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { renderContext, isArray } from '../utils';

Helmet.defaultProps.defer = false;

beforeAll(() => {
  Provider.canUseDOM = false;
});

afterAll(() => {
  Provider.canUseDOM = true;
});

describe('server', () => {
  describe('API', () => {
    it('renders script tags as React components', () => {
      const head = renderContext(
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
        />
      );

      expect(head.script).toBeDefined();
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(2);

      scriptComponent.forEach((script: Element) => {
        expect(script).toEqual(expect.objectContaining({ type: 'script' }));
      });

      const markup = ReactServer.renderToStaticMarkup(scriptComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders script tags as string', () => {
      const head = renderContext(
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
        />
      );

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders script tags as React components', () => {
      const head = renderContext(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
          <script src="http://localhost/test2.js" type="text/javascript" />
        </Helmet>
      );

      expect(head.script).toBeDefined();
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(2);

      scriptComponent.forEach((script: Element) => {
        expect(script).toEqual(expect.objectContaining({ type: 'script' }));
      });

      const markup = ReactServer.renderToStaticMarkup(scriptComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders script tags as string', () => {
      const head = renderContext(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
          <script src="http://localhost/test2.js" type="text/javascript" />
        </Helmet>
      );

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toMatchSnapshot();
    });
  });
});
