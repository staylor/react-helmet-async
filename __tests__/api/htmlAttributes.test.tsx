import React from 'react';

import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

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
        />
      );

      const htmlTag = document.documentElement;

      expect(htmlTag).toHaveAttribute('class', 'myClassName');
      expect(htmlTag).toHaveAttribute('lang', 'en');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'class,lang');
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

      expect(htmlTag).toHaveAttribute('lang', 'ja');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang');
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

      expect(htmlTag).toHaveAttribute('amp', '');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'amp');
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

      expect(htmlTag).not.toHaveAttribute('lang');
      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
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

      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).toHaveAttribute('lang', 'ja');
      expect(htmlTag).toHaveAttribute('id', 'html-tag');
      expect(htmlTag).toHaveAttribute('title', 'html tag');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang,id,title');
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

      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).not.toHaveAttribute('lang');
      expect(htmlTag).toHaveAttribute('id', 'html-tag');
      expect(htmlTag).toHaveAttribute('title', 'html tag');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'id,title');
    });

    describe('initialized outside of helmet', () => {
      beforeEach(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute('test', 'test');
      });

      it('attributes are not cleared', () => {
        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag).toHaveAttribute('test', 'test');
        expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
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

        expect(htmlTag).toHaveAttribute('test', 'helmet-attr');
        expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'test');
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

        expect(htmlTag).not.toHaveAttribute('test');
        expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
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

      expect(htmlTag).toHaveAttribute('class', 'myClassName');
      expect(htmlTag).toHaveAttribute('lang', 'en');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'class,lang');
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

      expect(htmlTag).toHaveAttribute('lang', 'ja');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet>
          <html
            // @ts-ignore
            amp
          />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag).toHaveAttribute('amp', 'true');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'amp');
    });

    it('clears html attributes that are handled within helmet', () => {
      render(
        <Helmet>
          <html
            lang="en"
            // @ts-ignore
            amp
          />
        </Helmet>
      );

      render(<Helmet />);

      const htmlTag = document.documentElement;

      expect(htmlTag).not.toHaveAttribute('lang');
      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
    });

    it('updates with multiple additions and removals - overwrite and new', () => {
      render(
        <Helmet>
          <html
            lang="en"
            // @ts-ignore
            amp
          />
        </Helmet>
      );

      render(
        <Helmet>
          <html lang="ja" id="html-tag" title="html tag" />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).toHaveAttribute('lang', 'ja');
      expect(htmlTag).toHaveAttribute('id', 'html-tag');
      expect(htmlTag).toHaveAttribute('title', 'html tag');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang,id,title');
    });

    it('updates with multiple additions and removals - all new', () => {
      render(
        <Helmet>
          <html
            lang="en"
            // @ts-ignore
            amp
          />
        </Helmet>
      );

      render(
        <Helmet>
          <html id="html-tag" title="html tag" />
        </Helmet>
      );

      const htmlTag = document.documentElement;

      expect(htmlTag).not.toHaveAttribute('amp');
      expect(htmlTag).not.toHaveAttribute('lang');
      expect(htmlTag).toHaveAttribute('id', 'html-tag');
      expect(htmlTag).toHaveAttribute('title', 'html tag');
      expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'id,title');
    });

    describe('initialized outside of helmet', () => {
      beforeEach(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute('test', 'test');
      });

      it('are not cleared', () => {
        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag).toHaveAttribute('test', 'test');
        expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
      });

      it('overwritten if specified in helmet', () => {
        render(
          <Helmet>
            <html
              // @ts-ignore
              test="helmet-attr"
            />
          </Helmet>
        );

        const htmlTag = document.documentElement;

        expect(htmlTag).toHaveAttribute('test', 'helmet-attr');
        expect(htmlTag).toHaveAttribute(HELMET_ATTRIBUTE, 'test');
      });

      it('cleared once it is managed in helmet', () => {
        render(
          <Helmet>
            <html
              // @ts-ignore
              test="helmet-attr"
            />
          </Helmet>
        );

        render(<Helmet />);

        const htmlTag = document.documentElement;

        expect(htmlTag).not.toHaveAttribute('test');
        expect(htmlTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
      });
    });
  });
});
