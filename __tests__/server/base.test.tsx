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
    it('renders base tag as React component', () => {
      const head = renderContext(<Helmet base={{ target: '_blank', href: 'http://localhost/' }} />);

      expect(head.base).toBeDefined();
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(1);

      baseComponent.forEach((base: Element) => {
        expect(base).toEqual(expect.objectContaining({ type: 'base' }));
      });

      const markup = ReactServer.renderToStaticMarkup(baseComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const head = renderContext(<Helmet base={{ target: '_blank', href: 'http://localhost/' }} />);
      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders base tag as React component', () => {
      const head = renderContext(
        <Helmet>
          <base target="_blank" href="http://localhost/" />
        </Helmet>
      );

      expect(head.base).toBeDefined();
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(1);

      baseComponent.forEach((base: Element) => {
        expect(base).toEqual(expect.objectContaining({ type: 'base' }));
      });

      const markup = ReactServer.renderToStaticMarkup(baseComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const head = renderContext(
        <Helmet>
          <base target="_blank" href="http://localhost/" />
        </Helmet>
      );

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });
  });
});
