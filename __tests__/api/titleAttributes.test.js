import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

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

      expect(titleTag.getAttribute('itemprop')).toBe('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('itemprop');
    });

    it('sets attributes based on the deepest nested component', () => {
      render(
        <div>
          <Helmet
            titleAttributes={{
              lang: 'en',
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

      expect(titleTag.getAttribute('lang')).toBe('ja');
      expect(titleTag.getAttribute('hidden')).toBe('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,hidden');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet
          titleAttributes={{
            hidden: undefined,
          }}
        />
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('hidden')).toBe('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      render(
        <Helmet
          titleAttributes={{
            lang: 'en',
            hidden: undefined,
          }}
        />
      );

      render(<Helmet />);

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('lang')).toBeNull();
      expect(titleTag.getAttribute('hidden')).toBeNull();
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
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

      expect(titleTag.getAttribute('itemprop')).toBe('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('itemprop');
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

      expect(titleTag.getAttribute('lang')).toBe('ja');
      expect(titleTag.getAttribute('hidden')).toBe('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,hidden');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet>
          <title hidden />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('hidden')).toBe('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      render(
        <Helmet>
          <title lang="en" hidden />
        </Helmet>
      );

      render(<Helmet />);

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('lang')).toBeNull();
      expect(titleTag.getAttribute('hidden')).toBeNull();
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });
});
