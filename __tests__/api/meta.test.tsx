import React from 'react';
import type { MockedFunction } from 'vitest';

import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('meta tags', () => {
  describe('API', () => {
    it('updates meta tags', () => {
      render(
        <Helmet
          meta={[
            { charset: 'utf-8' },
            {
              name: 'description',
              content: 'Test description',
            },
            {
              'http-equiv': 'content-type',
              content: 'text/html',
            },
            { property: 'og:type', content: 'article' },
            {
              itemprop: 'name',
              content: 'Test name itemprop',
            },
          ]}
        />
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          tag.getAttribute('charset') === 'utf-8' ||
          (tag.getAttribute('name') === 'description' &&
            tag.getAttribute('content') === 'Test description') ||
          (tag.getAttribute('http-equiv') === 'content-type' &&
            tag.getAttribute('content') === 'text/html') ||
          (tag.getAttribute('itemprop') === 'name' &&
            tag.getAttribute('content') === 'Test name itemprop')
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(4);
    });

    it('clears all meta tags if none are specified', () => {
      render(<Helmet meta={[{ name: 'description', content: 'Test description' }]} />);

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' are not accepted", () => {
      render(
        <Helmet
          meta={[
            {
              // @ts-ignore
              href: "won't work",
            },
          ]}
        />
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets meta tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet
            meta={[
              { charset: 'utf-8' },
              {
                name: 'description',
                content: 'Test description',
              },
            ]}
          />
          <Helmet
            meta={[
              {
                name: 'description',
                content: 'Inner description',
              },
              { name: 'keywords', content: 'test,meta,tags' },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag, thirdTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('charset', 'utf-8');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Inner description');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag).toHaveAttribute('name', 'keywords');
      expect(thirdTag).toHaveAttribute('content', 'test,meta,tags');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate meta tags if specified in the same component', () => {
      render(
        <Helmet
          meta={[
            {
              name: 'description',
              content: 'Test description',
            },
            {
              name: 'description',
              content: 'Duplicate description',
            },
          ]}
        />
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Test description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Duplicate description');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate meta tags with single meta tag in a nested component', () => {
      render(
        <div>
          <Helmet
            meta={[
              {
                name: 'description',
                content: 'Test description',
              },
              {
                name: 'description',
                content: 'Duplicate description',
              },
            ]}
          />
          <Helmet
            meta={[
              {
                name: 'description',
                content: 'Inner description',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single meta tag with duplicate meta tags in a nested component', () => {
      render(
        <div>
          <Helmet
            meta={[
              {
                name: 'description',
                content: 'Test description',
              },
            ]}
          />
          <Helmet
            meta={[
              {
                name: 'description',
                content: 'Inner description',
              },
              {
                name: 'description',
                content: 'Inner duplicate description',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Inner duplicate description');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet
          meta={[
            {
              name: undefined,
              content: 'Inner duplicate description',
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });

    it('fails gracefully when meta is wrong shape', () => {
      const originalConsole = global.console;
      global.console.warn = vi.fn();

      render(
        <Helmet
          meta={
            // @ts-ignore
            { name: 'title', content: 'some title' }
          }
        />
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);

      expect(console.warn).toHaveBeenCalled();

      expect((console.warn as MockedFunction<any>).mock.calls[0][0]).toMatchSnapshot();

      global.console = originalConsole;
    });
  });

  describe('Declarative API', () => {
    it('updates meta tags', () => {
      render(
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content="Test description" />
          <meta httpEquiv="content-type" content="text/html" />
          <meta property="og:type" content="article" />
          <meta itemProp="name" content="Test name itemprop" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          tag.getAttribute('charset') === 'utf-8' ||
          (tag.getAttribute('name') === 'description' &&
            tag.getAttribute('content') === 'Test description') ||
          (tag.getAttribute('http-equiv') === 'content-type' &&
            tag.getAttribute('content') === 'text/html') ||
          (tag.getAttribute('itemprop') === 'name' &&
            tag.getAttribute('content') === 'Test name itemprop')
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(4);
    });

    it('clears all meta tags if none are specified', () => {
      render(
        <Helmet>
          <meta name="description" content="Test description" />
        </Helmet>
      );

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' are not accepted", () => {
      render(
        <Helmet>
          <meta
            // @ts-ignore
            href="won't work"
          />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets meta tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <meta name="description" content="Test description" />
          </Helmet>
          <Helmet>
            <meta name="description" content="Inner description" />
            <meta name="keywords" content="test,meta,tags" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag, thirdTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('charset', 'utf-8');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Inner description');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag).toHaveAttribute('name', 'keywords');
      expect(thirdTag).toHaveAttribute('content', 'test,meta,tags');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate meta tags if specified in the same component', () => {
      render(
        <Helmet>
          <meta name="description" content="Test description" />
          <meta name="description" content="Duplicate description" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Test description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Duplicate description');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate meta tags with single meta tag in a nested component', () => {
      render(
        <div>
          <Helmet>
            <meta name="description" content="Test description" />
            <meta name="description" content="Duplicate description" />
          </Helmet>
          <Helmet>
            <meta name="description" content="Inner description" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single meta tag with duplicate meta tags in a nested component', () => {
      render(
        <div>
          <Helmet>
            <meta name="description" content="Test description" />
          </Helmet>
          <Helmet>
            <meta name="description" content="Inner description" />
            <meta name="description" content="Inner duplicate description" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('name', 'description');
      expect(firstTag).toHaveAttribute('content', 'Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('name', 'description');
      expect(secondTag).toHaveAttribute('content', 'Inner duplicate description');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet>
          <meta name={undefined} content="Inner duplicate description" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });
});
