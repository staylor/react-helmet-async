import React from 'react';

import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('title attributes', () => {
  beforeEach(() => {
    document.head.innerHTML = `<title>Test Title</title>`;
  });

  describe('API', () => {
    it('update title attributes', () => {
      render(
        <Helmet
          titleAttributes={{
            itemprop: 'name',
          }}
        />
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('itemprop', 'name');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'itemprop');
    });

    it('sets attributes based on the deepest nested component', () => {
      render(
        <div>
          <Helmet
            titleAttributes={{
              lang: 'en',
              // @ts-ignore
              hidden: undefined,
            }}
          />
          <Helmet
            titleAttributes={{
              lang: 'ja',
            }}
          />
        </div>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('lang', 'ja');
      expect(titleTag).toHaveAttribute('hidden', '');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang,hidden');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet
          titleAttributes={{
            // @ts-ignore
            hidden: undefined,
          }}
        />
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('hidden', '');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      render(
        <Helmet
          titleAttributes={{
            lang: 'en',
            // @ts-ignore
            hidden: undefined,
          }}
        />
      );

      render(<Helmet />);

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).not.toHaveAttribute('lang');
      expect(titleTag).not.toHaveAttribute('hidden');
      expect(titleTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
    });
  });

  describe('Declarative API', () => {
    it('updates title attributes', () => {
      render(
        <Helmet>
          <title itemProp="name" />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('itemprop', 'name');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'itemprop');
    });

    it('sets attributes based on the deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <title lang="en" hidden />
          </Helmet>
          <Helmet>
            <title lang="ja" />
          </Helmet>
        </div>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('lang', 'ja');
      expect(titleTag).toHaveAttribute('hidden', 'true');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang,hidden');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet>
          <title hidden />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).toHaveAttribute('hidden', 'true');
      expect(titleTag).toHaveAttribute(HELMET_ATTRIBUTE, 'hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      render(
        <Helmet>
          <title lang="en" hidden />
        </Helmet>
      );

      render(<Helmet />);

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag).not.toHaveAttribute('lang');
      expect(titleTag).not.toHaveAttribute('hidden');
      expect(titleTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
    });
  });
});
