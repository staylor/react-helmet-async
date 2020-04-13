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
    it('renders meta tags as React components', () => {
      const context = {};
      render(
        <Helmet
          meta={[
            { charset: 'utf-8' },
            {
              name: 'description',
              content: 'Test description & encoding of special characters like \' " > < `',
            },
            { 'http-equiv': 'content-type', content: 'text/html' },
            { property: 'og:type', content: 'article' },
            { itemprop: 'name', content: 'Test name itemprop' },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.meta).toBeDefined();
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toEqual(isArray);
      expect(metaComponent).toHaveLength(5);

      metaComponent.forEach(meta => {
        expect(meta).toEqual(expect.objectContaining({ type: 'meta' }));
      });

      const markup = ReactServer.renderToStaticMarkup(metaComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders meta tags as string', () => {
      const context = {};
      render(
        <Helmet
          meta={[
            { charset: 'utf-8' },
            {
              name: 'description',
              content: 'Test description & encoding of special characters like \' " > < `',
            },
            { 'http-equiv': 'content-type', content: 'text/html' },
            { property: 'og:type', content: 'article' },
            { itemprop: 'name', content: 'Test name itemprop' },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders meta tags as React components', () => {
      const context = {};
      render(
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content={'Test description & encoding of special characters like \' " > < `'}
          />
          <meta httpEquiv="content-type" content="text/html" />
          <meta property="og:type" content="article" />
          <meta itemProp="name" content="Test name itemprop" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.meta).toBeDefined();
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toEqual(isArray);
      expect(metaComponent).toHaveLength(5);

      metaComponent.forEach(meta => {
        expect(meta).toEqual(expect.objectContaining({ type: 'meta' }));
      });

      const markup = ReactServer.renderToStaticMarkup(metaComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders meta tags as string', () => {
      const context = {};
      render(
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content='Test description &amp; encoding of special characters like &#x27; " &gt; &lt; `'
          />
          <meta httpEquiv="content-type" content="text/html" />
          <meta property="og:type" content="article" />
          <meta itemProp="name" content="Test name itemprop" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toMatchSnapshot();
    });
  });
});
