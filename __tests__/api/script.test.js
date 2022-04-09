import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

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

      const existingTags = document.head.getElementsByTagName('script');

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
          tag =>
            (tag.getAttribute('src') === 'http://localhost/test.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('src') === 'http://localhost/test2.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('type') === 'application/ld+json' &&
              tag.innerHTML === scriptInnerHTML)
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

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('src')).toBe('http://localhost/test.js');
      expect(firstTag.getAttribute('type')).toBe('text/javascript');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('src')).toBe('http://localhost/test2.js');
      expect(secondTag.getAttribute('type')).toBe('text/javascript');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets undefined attribute values to empty strings', () => {
      render(
        <Helmet
          script={[
            {
              src: 'foo.js',
              async: undefined,
            },
          ]}
        />
      );

      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTag).toBeDefined();
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute (src) is null', () => {
      render(
        <Helmet
          script={[
            {
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

      const existingTags = document.head.getElementsByTagName('script');

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
          tag =>
            (tag.getAttribute('src') === 'http://localhost/test.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('src') === 'http://localhost/test2.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('type') === 'application/ld+json' &&
              tag.innerHTML === scriptInnerHTML)
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

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('src')).toBe('http://localhost/test.js');
      expect(firstTag.getAttribute('type')).toBe('text/javascript');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('src')).toBe('http://localhost/test2.js');
      expect(secondTag.getAttribute('type')).toBe('text/javascript');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets undefined attribute values to empty strings', () => {
      render(
        <Helmet>
          <script src="foo.js" async={undefined} />
        </Helmet>
      );

      const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`);

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
          <script innerHTML={undefined} />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });
});
