import React from 'react';

import type { BodyProps } from '../../src';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE, HTML_TAG_MAP } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('body attributes', () => {
  describe('valid attributes', () => {
    const attributeList: BodyProps = {
      accessKey: 'c',
      className: 'test',
      contentEditable: 'true',
      contextMenu: 'mymenu',
      'data-animal-type': 'lion',
      dir: 'rtl',
      draggable: 'true',
      dropzone: 'copy',
      // @ts-ignore
      hidden: 'true',
      id: 'test',
      lang: 'fr',
      spellcheck: 'true',
      // @ts-ignore
      style: 'color: green',
      // @ts-ignore
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

        expect(bodyTag).toHaveAttribute(reactCompatAttr, attrValue);
        expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, reactCompatAttr);
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

    expect(bodyTag).toHaveAttribute('class', 'myClassName');
    expect(bodyTag).toHaveAttribute('tabindex', '-1');
    expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'class,tabindex');
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

    expect(bodyTag).toHaveAttribute('lang', 'ja');
    expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang');
  });

  it('handles valueless attributes', () => {
    render(
      <Helmet>
        <body hidden />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag).toHaveAttribute('hidden', 'true');
    expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'hidden');
  });

  it('clears body attributes that are handled within helmet', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(<Helmet />);

    const bodyTag = document.body;

    expect(bodyTag).not.toHaveAttribute('lang');
    expect(bodyTag).not.toHaveAttribute('hidden');
    expect(bodyTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
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

    expect(bodyTag).not.toHaveAttribute('hidden');
    expect(bodyTag).toHaveAttribute('lang', 'ja');
    expect(bodyTag).toHaveAttribute('id', 'body-tag');
    expect(bodyTag).toHaveAttribute('title', 'body tag');
    expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'lang,id,title');
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

    expect(bodyTag).not.toHaveAttribute('hidden');
    expect(bodyTag).not.toHaveAttribute('lang');
    expect(bodyTag).toHaveAttribute('id', 'body-tag');
    expect(bodyTag).toHaveAttribute('title', 'body tag');
    expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'id,title');
  });

  describe('initialized outside of helmet', () => {
    beforeEach(() => {
      const bodyTag = document.body;
      bodyTag.setAttribute('test', 'test');
    });

    it('attributes are not cleared', () => {
      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag).toHaveAttribute('test', 'test');
      expect(bodyTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
    });

    it('attributes are overwritten if specified in helmet', () => {
      render(
        <Helmet>
          <body
            // @ts-ignore
            test="helmet-attr"
          />
        </Helmet>
      );

      const bodyTag = document.body;

      expect(bodyTag).toHaveAttribute('test', 'helmet-attr');
      expect(bodyTag).toHaveAttribute(HELMET_ATTRIBUTE, 'test');
    });

    it('attributes are cleared once managed in helmet', () => {
      render(
        <Helmet>
          <body
            // @ts-ignore
            test="helmet-attr"
          />
        </Helmet>
      );

      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag).not.toHaveAttribute('test');
      expect(bodyTag).not.toHaveAttribute(HELMET_ATTRIBUTE);
    });
  });
});
