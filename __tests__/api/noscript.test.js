import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

Helmet.defaultProps.defer = false;

describe('noscript tags', () => {
  describe('API', () => {
    it('updates noscript tags', () => {
      render(
        <Helmet
          noscript={[
            {
              id: 'bar',
              innerHTML: `<link rel="stylesheet" type="text/css" href="foo.css" />`,
            },
          ]}
        />
      );

      const existingTags = document.head.getElementsByTagName('noscript');

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);
      expect(existingTags[0].id).toBe('bar');
      expect(existingTags[0].outerHTML).toMatchSnapshot();
    });

    it('clears all noscripts tags if none are specified', () => {
      render(<Helmet noscript={[{ id: 'bar' }]} />);

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'innerHTML' are not accepted", () => {
      render(<Helmet noscript={[{ property: "won't work" }]} />);

      const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet
          noscript={[
            {
              innerHTML: undefined,
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });

  describe('Declarative API', () => {
    it('updates noscript tags', () => {
      render(
        <Helmet>
          <noscript id="bar">{`<link rel="stylesheet" type="text/css" href="foo.css" />`}</noscript>
        </Helmet>
      );

      const existingTags = document.head.getElementsByTagName('noscript');

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);
      expect(existingTags[0].id).toBe('bar');
      expect(existingTags[0].outerHTML).toMatchSnapshot();
    });

    it('clears all noscripts tags if none are specified', () => {
      render(
        <Helmet>
          <noscript id="bar" />
        </Helmet>
      );

      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'innerHTML' are not accepted", () => {
      render(
        <Helmet>
          <noscript property="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet>
          <noscript>{undefined}</noscript>
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });
});
