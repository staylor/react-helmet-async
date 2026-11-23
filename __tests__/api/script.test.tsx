import React from 'react';

import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('script tags', () => {
  describe('API', () => {
    it('updates script tags', () => {
      const scriptInnerHTML = `
                {
                  "@context": "http://schema.org",
                  "@type": "NewsArticle",
                  "url": "http://localhost/helmet"
                }
              `;
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
            {
              type: 'application/ld+json',
              innerHTML: scriptInnerHTML,
            },
          ]}
        />
      );

      const existingTags = [...document.head.getElementsByTagName('script')];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        (tag) =>
          (tag.getAttribute('src') === 'http://localhost/test.js' &&
            tag.getAttribute('type') === 'text/javascript') ||
          (tag.getAttribute('src') === 'http://localhost/test2.js' &&
            tag.getAttribute('type') === 'text/javascript') ||
          (tag.getAttribute('type') === 'application/ld+json' && tag.innerHTML === scriptInnerHTML)
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(3);
    });

    it('clears all scripts tags if none are specified', () => {
      render(
        <Helmet
          script={[
            {
              src: 'http://localhost/test.js',
              type: 'text/javascript',
            },
          ]}
        />
      );

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'src' are not accepted", () => {
      render(<Helmet script={[{ property: "won't work" }]} />);

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets script tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
            ]}
          />
          <Helmet
            script={[
              {
                src: 'http://localhost/test2.js',
                type: 'text/javascript',
              },
            ]}
          />
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('src', 'http://localhost/test.js');
      expect(firstTag).toHaveAttribute('type', 'text/javascript');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('src', 'http://localhost/test2.js');
      expect(secondTag).toHaveAttribute('type', 'text/javascript');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets undefined attribute values to empty strings', () => {
      render(
        <Helmet
          script={[
            {
              src: 'foo.js',
              // @ts-expect-error -- undefined attribute on purpose
              async: undefined,
            },
          ]}
        />
      );

      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`) as Element;

      expect(existingTag).toBeDefined();
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute (src) is null', () => {
      render(
        <Helmet
          script={[
            {
              // @ts-expect-error -- missing src on purpose
              src: undefined,
              type: 'text/javascript',
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });

    it('does not render tag when primary attribute (innerHTML) is null', () => {
      render(
        <Helmet
          script={[
            {
              // @ts-expect-error -- missing innerHTML on purpose
              innerHTML: undefined,
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });

  describe('Declarative API', () => {
    it('updates script tags', () => {
      const scriptInnerHTML = `
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "url": "http://localhost/helmet"
          }
        `;
      render(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
          <script src="http://localhost/test2.js" type="text/javascript" />
          <script type="application/ld+json">{scriptInnerHTML}</script>
        </Helmet>
      );

      const existingTags = [...document.head.getElementsByTagName('script')];

      expect(existingTags).toBeDefined();

      const filteredTags = existingTags.filter(
        (tag) =>
          (tag.getAttribute('src') === 'http://localhost/test.js' &&
            tag.getAttribute('type') === 'text/javascript') ||
          (tag.getAttribute('src') === 'http://localhost/test2.js' &&
            tag.getAttribute('type') === 'text/javascript') ||
          (tag.getAttribute('type') === 'application/ld+json' && tag.innerHTML === scriptInnerHTML)
      );

      expect(filteredTags.length).toBeGreaterThanOrEqual(3);
    });

    it('clears all scripts tags if none are specified', () => {
      render(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
        </Helmet>
      );

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'src' are not accepted", () => {
      render(
        <Helmet>
          <script property="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets script tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <script src="http://localhost/test.js" type="text/javascript" />
            <script src="http://localhost/test2.js" type="text/javascript" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`)];
      const [firstTag, secondTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('src', 'http://localhost/test.js');
      expect(firstTag).toHaveAttribute('type', 'text/javascript');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag).toHaveAttribute('src', 'http://localhost/test2.js');
      expect(secondTag).toHaveAttribute('type', 'text/javascript');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets undefined attribute values to empty strings', () => {
      render(
        <Helmet>
          <script src="foo.js" async={undefined} />
        </Helmet>
      );

      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`) as Element;

      expect(existingTag).toBeDefined();
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute (src) is null', () => {
      render(
        <Helmet>
          <script src={undefined} type="text/javascript" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });

    it('does not render tag when primary attribute (innerHTML) is null', () => {
      render(
        <Helmet>
          <script
            // @ts-expect-error -- missing innerHTML on purpose
            innerHTML={undefined}
          />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });

    it('attaches function props as event handlers', () => {
      const onLoad = vi.fn();
      render(
        <Helmet>
          <script src="http://localhost/test.js" onLoad={onLoad} />
        </Helmet>
      );

      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`) as Element;
      existingTag.dispatchEvent(new Event('load'));

      expect(existingTag).not.toHaveAttribute('onload');
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('replaces the handler on a tag it keeps', () => {
      const firstOnLoad = vi.fn();
      const secondOnLoad = vi.fn();
      render(
        <Helmet>
          <script src="http://localhost/test.js" onLoad={firstOnLoad} />
        </Helmet>
      );
      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`) as Element;

      render(
        <Helmet>
          <script src="http://localhost/test.js" onLoad={secondOnLoad} />
        </Helmet>
      );
      existingTag.dispatchEvent(new Event('load'));

      expect(document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`)).toBe(existingTag);
      expect(firstOnLoad).not.toHaveBeenCalled();
      expect(secondOnLoad).toHaveBeenCalledTimes(1);
    });

    it('leaves out attributes set to false or null, as React does', () => {
      render(
        <Helmet>
          <script
            src="http://localhost/test.js"
            async
            defer={false}
            noModule={false}
            // @ts-expect-error -- null on purpose
            crossOrigin={null}
            data-cfasync={false}
          />
        </Helmet>
      );

      const script = document.head.querySelector(
        `script[${HELMET_ATTRIBUTE}]`
      ) as HTMLScriptElement;

      expect(script).toHaveAttribute('async');
      expect(script).not.toHaveAttribute('defer');
      expect(script).not.toHaveAttribute('nomodule');
      expect(script).not.toHaveAttribute('crossorigin');
      expect(script).toHaveAttribute('data-cfasync', 'false');
      expect(script.defer).toBe(false);
    });

    it('keeps scripts in order when one of them changes', () => {
      const Scripts = ({ id }: { id: number }) => (
        <Helmet>
          <script>{`var data = { id: ${id} };`}</script>
          <script src="http://localhost/first.js" />
          <script src="http://localhost/second.js" />
        </Helmet>
      );

      render(<Scripts id={1} />);
      render(<Scripts id={2} />);

      const scripts = [...document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`)];

      expect(scripts.map((tag) => tag.getAttribute('src') || tag.innerHTML)).toEqual([
        'var data = { id: 2 };',
        'http://localhost/first.js',
        'http://localhost/second.js',
      ]);
    });

    it('joins children that mix text and values', () => {
      const id = 'abc';

      render(
        <Helmet>
          <script>var id = "{id}";</script>
        </Helmet>
      );

      const scripts = [...document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`)];

      expect(scripts).toHaveLength(1);
      expect(scripts[0].innerHTML).toBe('var id = "abc";');
    });
  });
});
