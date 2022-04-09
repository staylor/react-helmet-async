import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE, HTML_TAG_MAP } from '../../src/constants';
import { render } from './utils';

Helmet.defaultProps.defer = false;

describe('body attributes', () => {
  describe('valid attributes', () => {
    const attributeList = {
      accessKey: 'c',
      className: 'test',
      contentEditable: 'true',
      contextMenu: 'mymenu',
      'data-animal-type': 'lion',
      dir: 'rtl',
      draggable: 'true',
      dropzone: 'copy',
      hidden: 'true',
      id: 'test',
      lang: 'fr',
      spellcheck: 'true',
      style: 'color:green',
      tabIndex: '-1',
      title: 'test',
      translate: 'no',
    };

    Object.keys(attributeList).forEach(attribute => {
      it(`${attribute}`, () => {
        const attrValue = attributeList[attribute];

        const attr = {
          [attribute]: attrValue,
        };

        render(
          <Helmet>
            <body {...attr} />
          </Helmet>
        );

        const bodyTag = document.body;

        const reactCompatAttr = HTML_TAG_MAP[attribute] || attribute;

        expect(bodyTag.getAttribute(reactCompatAttr)).toEqual(attrValue);
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual(reactCompatAttr);
      });
    });
  });

  it('updates multiple body attributes', () => {
    render(
      <Helmet>
        <body className="myClassName" tabIndex={-1} />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('class')).toBe('myClassName');
    expect(bodyTag.getAttribute('tabindex')).toBe('-1');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,tabindex');
  });

  it('sets attributes based on the deepest nested component', () => {
    render(
      <div>
        <Helmet>
          <body lang="en" />
        </Helmet>
        <Helmet>
          <body lang="ja" />
        </Helmet>
      </div>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('lang')).toBe('ja');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
  });

  it('handles valueless attributes', () => {
    render(
      <Helmet>
        <body hidden />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toBe('true');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
  });

  it('clears body attributes that are handled within helmet', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(<Helmet />);

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('lang')).toBeNull();
    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
  });

  it('updates with multiple additions and removals - overwrite and new', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(
      <Helmet>
        <body lang="ja" id="body-tag" title="body tag" />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute('lang')).toBe('ja');
    expect(bodyTag.getAttribute('id')).toBe('body-tag');
    expect(bodyTag.getAttribute('title')).toBe('body tag');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
  });

  it('updates with multiple additions and removals - all new', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(
      <Helmet>
        <body id="body-tag" title="body tag" />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute('lang')).toBeNull();
    expect(bodyTag.getAttribute('id')).toBe('body-tag');
    expect(bodyTag.getAttribute('title')).toBe('body tag');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
  });

  describe('initialized outside of helmet', () => {
    beforeEach(() => {
      const bodyTag = document.body;
      bodyTag.setAttribute('test', 'test');
    });

    it('attributes are not cleared', () => {
      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toBe('test');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('attributes are overwritten if specified in helmet', () => {
      render(
        <Helmet>
          <body test="helmet-attr" />
        </Helmet>
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toBe('helmet-attr');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('test');
    });

    it('attributes are cleared once managed in helmet', () => {
      render(
        <Helmet>
          <body test="helmet-attr" />
        </Helmet>
      );

      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toBeNull();
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });
});
