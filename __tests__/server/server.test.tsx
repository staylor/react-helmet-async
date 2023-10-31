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
    it('rewind() provides a fallback object for empty Helmet state', () => {
      const head = renderContext(<div />);

      expect(head.htmlAttributes).toBeDefined();
      expect(head.htmlAttributes.toString).toBeDefined();
      expect(head.htmlAttributes.toString()).toBe('');
      expect(head.htmlAttributes.toComponent).toBeDefined();
      expect(head.htmlAttributes.toComponent()).toEqual({});

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
      expect(head.title.toComponent).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(head.title.toComponent());

      expect(markup).toMatchSnapshot();

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toBe('');
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(0);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toEqual(isArray);
      expect(metaComponent).toHaveLength(0);

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toBe('');
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toEqual(isArray);
      expect(linkComponent).toHaveLength(0);

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toBe('');
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(0);

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toString).toBeDefined();
      expect(head.noscript.toString()).toBe('');
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toEqual(isArray);
      expect(noscriptComponent).toHaveLength(0);

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toBe('');
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toEqual(isArray);
      expect(styleComponent).toHaveLength(0);

      expect(head.priority).toBeDefined();
      expect(head.priority.toString).toBeDefined();
      expect(head.priority.toString()).toBe('');
      expect(head.priority.toComponent).toBeDefined();
    });

    it('does not render undefined attribute values', () => {
      const head = renderContext(
        <Helmet
          script={[
            {
              src: 'foo.js',
              // @ts-ignore
              async: undefined,
            },
          ]}
        />
      );

      expect(head.script.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('provides initial values if no state is found', () => {
      const head = renderContext(<div />);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();

      expect(head.meta.toString()).toBe('');
    });

    it('rewind() provides a fallback object for empty Helmet state', () => {
      const head = renderContext(<div />);

      expect(head.htmlAttributes).toBeDefined();
      expect(head.htmlAttributes.toString).toBeDefined();
      expect(head.htmlAttributes.toString()).toBe('');
      expect(head.htmlAttributes.toComponent).toBeDefined();
      expect(head.htmlAttributes.toComponent()).toEqual({});

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
      expect(head.title.toComponent).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(head.title.toComponent());

      expect(markup).toMatchSnapshot();

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toBe('');
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(0);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
      expect(head.meta.toComponent).toBeDefined();

      const metaComponent = head.meta.toComponent();

      expect(metaComponent).toEqual(isArray);
      expect(metaComponent).toHaveLength(0);

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toBe('');
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toEqual(isArray);
      expect(linkComponent).toHaveLength(0);

      expect(head.script).toBeDefined();
      expect(head.script.toString).toBeDefined();
      expect(head.script.toString()).toBe('');
      expect(head.script.toComponent).toBeDefined();

      const scriptComponent = head.script.toComponent();

      expect(scriptComponent).toEqual(isArray);
      expect(scriptComponent).toHaveLength(0);

      expect(head.noscript).toBeDefined();
      expect(head.noscript.toString).toBeDefined();
      expect(head.noscript.toString()).toBe('');
      expect(head.noscript.toComponent).toBeDefined();

      const noscriptComponent = head.noscript.toComponent();

      expect(noscriptComponent).toEqual(isArray);
      expect(noscriptComponent).toHaveLength(0);

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toBe('');
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toEqual(isArray);
      expect(styleComponent).toHaveLength(0);

      expect(head.priority).toBeDefined();
      expect(head.priority.toString).toBeDefined();
      expect(head.priority.toString()).toBe('');
      expect(head.priority.toComponent).toBeDefined();
    });

    it('does not render undefined attribute values', () => {
      const head = renderContext(
        <Helmet>
          <script src="foo.js" async={undefined} />
        </Helmet>
      );

      expect(head.script.toString()).toMatchSnapshot();
    });

    it('prioritizes SEO tags when asked to', () => {
      const head = renderContext(
        <Helmet prioritizeSeoTags>
          <link rel="notImportant" href="https://www.chipotle.com" />
          <link rel="canonical" href="https://www.tacobell.com" />
          <meta property="og:title" content="A very important title" />
        </Helmet>
      );

      expect(head.priority.toString()).toContain('rel="canonical" href="https://www.tacobell.com"');
      expect(head.link.toString()).not.toContain('rel="canonical" href="https://www.tacobell.com"');

      expect(head.priority.toString()).toContain(
        'property="og:title" content="A very important title"'
      );
      expect(head.meta.toString()).not.toContain(
        'property="og:title" content="A very important title"'
      );
    });

    it('does not prioritize SEO unless asked to', () => {
      const head = renderContext(
        <Helmet>
          <link rel="notImportant" href="https://www.chipotle.com" />
          <link rel="canonical" href="https://www.tacobell.com" />
          <meta property="og:title" content="A very important title" />
        </Helmet>
      );

      expect(head.priority.toString()).not.toContain(
        'rel="canonical" href="https://www.tacobell.com"'
      );
      expect(head.link.toString()).toContain('rel="canonical" href="https://www.tacobell.com"');

      expect(head.priority.toString()).not.toContain(
        'property="og:title" content="A very important title"'
      );
      expect(head.meta.toString()).toContain(
        'property="og:title" content="A very important title"'
      );
    });
  });
});
