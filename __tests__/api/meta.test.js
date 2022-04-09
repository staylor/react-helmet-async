import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

/* eslint-disable no-console */

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
            { itemprop: 'name', content: 'Test name itemprop' },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
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
      render(<Helmet meta={[{ href: "won't work" }]} />);

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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('charset')).toBe('utf-8');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Inner description');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute('name')).toBe('keywords');
      expect(thirdTag.getAttribute('content')).toBe('test,meta,tags');
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Test description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Duplicate description');
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Inner description');
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Inner duplicate description');
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
      global.console.warn = jest.fn();
      global.console.error = jest.fn();

      render(<Helmet meta={{ name: 'title', content: 'some title' }} />);

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);

      expect(console.error).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();

      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();

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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
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
          <meta href="won't work" />
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(3);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('charset')).toBe('utf-8');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Inner description');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute('name')).toBe('keywords');
      expect(thirdTag.getAttribute('content')).toBe('test,meta,tags');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate meta tags if specified in the same component', () => {
      render(
        <Helmet>
          <meta name="description" content="Test description" />
          <meta name="description" content="Duplicate description" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Test description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Duplicate description');
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Inner description');
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

      const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('Inner description');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('name')).toBe('description');
      expect(secondTag.getAttribute('content')).toBe('Inner duplicate description');
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
