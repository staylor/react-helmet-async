import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

/* eslint-disable jsx-a11y/html-has-lang */

Helmet.defaultProps.defer = false;

describe('html attributes', () => {
  describe('API', () => {
    it('updates html attributes', () => {
      render(
        <Helmet
          htmlAttributes={{
            class: 'myClassName',
            lang: 'en',
          }}
          lang="en"
        />
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('class')).toBe('myClassName');
      expect(htmlTag.getAttribute('lang')).toBe('en');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,lang');
    });

    it('sets attributes based on the deepest nested component', () => {
      render(
        <div>
          <Helmet
            htmlAttributes={{
              lang: 'en',
            }}
          />
          <Helmet
            htmlAttributes={{
              lang: 'ja',
            }}
          />
        </div>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('lang')).toBe('ja');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet
          htmlAttributes={{
            amp: undefined,
          }}
        />
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBe('');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('amp');
    });

    it('clears html attributes that are handled within helmet', () => {
      render(
        <Helmet
          htmlAttributes={{
            lang: 'en',
            amp: undefined,
          }}
        />
      );

      render(<Helmet />);

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('lang')).toBeNull();
      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('updates with multiple additions and removals - overwrite and new', () => {
      render(
        <Helmet
          htmlAttributes={{
            lang: 'en',
            amp: undefined,
          }}
        />
      );

      render(
        <Helmet
          htmlAttributes={{
            lang: 'ja',
            id: 'html-tag',
            title: 'html tag',
          }}
        />
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute('lang')).toBe('ja');
      expect(htmlTag.getAttribute('id')).toBe('html-tag');
      expect(htmlTag.getAttribute('title')).toBe('html tag');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
    });

    it('updates with multiple additions and removals - all new', () => {
      render(
        <Helmet
          htmlAttributes={{
            lang: 'en',
            amp: undefined,
          }}
        />
      );

      render(
        <Helmet
          htmlAttributes={{
            id: 'html-tag',
            title: 'html tag',
          }}
        />
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute('lang')).toBeNull();
      expect(htmlTag.getAttribute('id')).toBe('html-tag');
      expect(htmlTag.getAttribute('title')).toBe('html tag');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
    });

    describe('initialized outside of helmet', () => {
      beforeEach(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute('test', 'test');
      });

      it('attributes are not cleared', () => {
        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBe('test');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });

      it('attributes are overwritten if specified in helmet', () => {
        render(
          <Helmet
            htmlAttributes={{
              test: 'helmet-attr',
            }}
          />
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBe('helmet-attr');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('test');
      });

      it('attributes are cleared once managed in helmet', () => {
        render(
          <Helmet
            htmlAttributes={{
              test: 'helmet-attr',
            }}
          />
        );

        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBeNull();
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });
    });
  });

  describe('Declarative API', () => {
    it('updates html attributes', () => {
      render(
        <Helmet>
          <html className="myClassName" lang="en" />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('class')).toBe('myClassName');
      expect(htmlTag.getAttribute('lang')).toBe('en');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,lang');
    });

    it('sets attributes based on the deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <html lang="en" />
          </Helmet>
          <Helmet>
            <html lang="ja" />
          </Helmet>
        </div>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('lang')).toBe('ja');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet>
          <html amp />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBe('true');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('amp');
    });

    it('clears html attributes that are handled within helmet', () => {
      render(
        <Helmet>
          <html lang="en" amp />
        </Helmet>
      );

      render(<Helmet />);

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('lang')).toBeNull();
      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('updates with multiple additions and removals - overwrite and new', () => {
      render(
        <Helmet>
          <html lang="en" amp />
        </Helmet>
      );

      render(
        <Helmet>
          <html lang="ja" id="html-tag" title="html tag" />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute('lang')).toBe('ja');
      expect(htmlTag.getAttribute('id')).toBe('html-tag');
      expect(htmlTag.getAttribute('title')).toBe('html tag');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
    });

    it('updates with multiple additions and removals - all new', () => {
      render(
        <Helmet>
          <html lang="en" amp />
        </Helmet>
      );

      render(
        <Helmet>
          <html id="html-tag" title="html tag" />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag.getAttribute('amp')).toBeNull();
      expect(htmlTag.getAttribute('lang')).toBeNull();
      expect(htmlTag.getAttribute('id')).toBe('html-tag');
      expect(htmlTag.getAttribute('title')).toBe('html tag');
      expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
    });

    describe('initialized outside of helmet', () => {
      beforeEach(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute('test', 'test');
      });

      it('are not cleared', () => {
        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBe('test');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });

      it('overwritten if specified in helmet', () => {
        render(
          <Helmet>
            <html test="helmet-attr" />
          </Helmet>
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBe('helmet-attr');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('test');
      });

      it('cleared once it is managed in helmet', () => {
        render(
          <Helmet>
            <html test="helmet-attr" />
          </Helmet>
        );

        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('test')).toBeNull();
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });
    });
  });
});
