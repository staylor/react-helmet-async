import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from '../../src';
import Provider from '../../src/Provider';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

const mount = document.getElementById('mount');

const render = node => {
  ReactDOM.render(<Provider>{node}</Provider>, mount);
};

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
      expect(titleTag.getAttribute('itemprop')).toEqual('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('itemprop');
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
      expect(titleTag.getAttribute('lang')).toEqual('ja');
      expect(titleTag.getAttribute('hidden')).toEqual('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('lang,hidden');
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
      expect(titleTag.getAttribute('hidden')).toEqual('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('hidden');
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

      expect(titleTag.getAttribute('itemprop')).toEqual('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('itemprop');
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

      expect(titleTag.getAttribute('lang')).toEqual('ja');
      expect(titleTag.getAttribute('hidden')).toEqual('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('lang,hidden');
    });

    it('handles valueless attributes', () => {
      render(
        <Helmet>
          <title hidden />
        </Helmet>
      );

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('hidden')).toEqual('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      render(
        <Helmet>
          <title lang="en" hidden />
        </Helmet>
      );

      render(<Helmet />);

      const titleTag = document.getElementsByTagName('title')[0];

      expect(titleTag.getAttribute('lang')).toEqual(null);
      expect(titleTag.getAttribute('hidden')).toEqual(null);
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toEqual(null);
    });
  });
});
