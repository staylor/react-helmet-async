import React from 'react';

import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('link tags', () => {
  describe('API', () => {
    it('updates link tags', () => {
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/helmet',
              rel: 'canonical',
            },
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
        />
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          (tag.getAttribute('href') === 'http://localhost/style.css' &&
            tag.getAttribute('rel') === 'stylesheet' &&
            tag.getAttribute('type') === 'text/css') ||
          (tag.getAttribute('href') === 'http://localhost/helmet' &&
            tag.getAttribute('rel') === 'canonical')
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(2);
    });

    it('clears all link tags if none are specified', () => {
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/helmet',
              rel: 'canonical',
            },
          ]}
        />
      );

      render(<Helmet />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", () => {
      // @ts-ignore
      render(<Helmet link={[{ 'http-equiv': "won't work" }]} />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet
            link={[
              {
                href: 'http://localhost/helmet',
                rel: 'canonical',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/new',
              },
            ]}
          />
          <Helmet
            link={[
              {
                href: 'http://localhost/helmet/newest',
                rel: 'canonical',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/newest');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet
            link={[
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'stylesheet',
                href: 'http://localhost/inner.css',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/style.css');
      expect(firstTag).toHaveAttribute('rel', 'stylesheet');
      expect(firstTag).toHaveAttribute('type', 'text/css');
      expect(firstTag).toHaveAttribute('media', 'all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'stylesheet');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/inner.css');
      expect(secondTag).toHaveAttribute('type', 'text/css');
      expect(secondTag).toHaveAttribute('media', 'all');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets link tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
              {
                href: 'http://localhost/inner.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag, thirdTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/style.css');
      expect(firstTag).toHaveAttribute('rel', 'stylesheet');
      expect(firstTag).toHaveAttribute('type', 'text/css');
      expect(firstTag).toHaveAttribute('media', 'all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag).toHaveAttribute('href', 'http://localhost/inner.css');
      expect(thirdTag).toHaveAttribute('rel', 'stylesheet');
      expect(thirdTag).toHaveAttribute('type', 'text/css');
      expect(thirdTag).toHaveAttribute('media', 'all');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate link tags if specified in the same component', () => {
      render(
        <Helmet
          link={[
            {
              rel: 'canonical',
              href: 'http://localhost/helmet',
            },
            {
              rel: 'canonical',
              href: 'http://localhost/helmet/component',
            },
          ]}
        />
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate link tags with a single link tag in a nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single link tag with duplicate link tags in a nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet
          link={[
            // @ts-ignore
            { rel: 'icon', sizes: '192x192', href: null },
            {
              rel: 'canonical',
              href: 'http://localhost/helmet/component',
            },
          ]}
        />
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('updates link tags', () => {
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        tag =>
          (tag.getAttribute('href') === 'http://localhost/style.css' &&
            tag.getAttribute('rel') === 'stylesheet' &&
            tag.getAttribute('type') === 'text/css') ||
          (tag.getAttribute('href') === 'http://localhost/helmet' &&
            tag.getAttribute('rel') === 'canonical')
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(2);
    });

    it('clears all link tags if none are specified', () => {
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
        </Helmet>
      );

      render(<Helmet />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", () => {
      render(
        <Helmet>
          <link
            // @ts-ignore
            httpEquiv="won't work"
          />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <link href="http://localhost/helmet" rel="canonical" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/new" />
          </Helmet>
          <Helmet>
            <link href="http://localhost/helmet/newest" rel="canonical" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/newest');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <Helmet>
            <link rel="stylesheet" href="http://localhost/inner.css" type="text/css" media="all" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/style.css');
      expect(firstTag).toHaveAttribute('rel', 'stylesheet');
      expect(firstTag).toHaveAttribute('type', 'text/css');
      expect(firstTag).toHaveAttribute('media', 'all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'stylesheet');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/inner.css');
      expect(secondTag).toHaveAttribute('type', 'text/css');
      expect(secondTag).toHaveAttribute('media', 'all');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets link tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
            <link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
            <link href="http://localhost/inner.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag, thirdTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/style.css');
      expect(firstTag).toHaveAttribute('rel', 'stylesheet');
      expect(firstTag).toHaveAttribute('type', 'text/css');
      expect(firstTag).toHaveAttribute('media', 'all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag).toHaveAttribute('href', 'http://localhost/inner.css');
      expect(thirdTag).toHaveAttribute('rel', 'stylesheet');
      expect(thirdTag).toHaveAttribute('type', 'text/css');
      expect(thirdTag).toHaveAttribute('media', 'all');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate link tags if specified in the same component', () => {
      render(
        <Helmet>
          <link rel="canonical" href="http://localhost/helmet" />
          <link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate link tags with a single link tag in a nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
            <link rel="canonical" href="http://localhost/helmet/component" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single link tag with duplicate link tags in a nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/component" />
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('rel', 'canonical');
      expect(secondTag).toHaveAttribute('href', 'http://localhost/helmet/innercomponent');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet>
          <link
            rel="icon"
            sizes="192x192"
            // @ts-ignore
            href={null}
          />
          <link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('rel', 'canonical');
      expect(firstTag).toHaveAttribute('href', 'http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });
});
