import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

Helmet.defaultProps.defer = false;

describe('base tag', () => {
  describe('API', () => {
    it('updates base tag', () => {
      render(<Helmet base={{ href: 'http://mysite.com/' }} />);

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(tag => tag.getAttribute('href') === 'http://mysite.com/');

      expect(filteredTags).toHaveLength(1);
    });

    it('clears the base tag if one is not specified', () => {
      render(<Helmet base={{ href: 'http://mysite.com/' }} />);
      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' are not accepted", () => {
      render(<Helmet base={{ property: "won't work" }} />);
      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets base tag based on deepest nested component', () => {
      render(
        <div>
          <Helmet base={{ href: 'http://mysite.com/' }} />
          <Helmet base={{ href: 'http://mysite.com/public' }} />
        </div>
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const firstTag = [].slice.call(existingTags)[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://mysite.com/public');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(<Helmet base={{ href: undefined }} />);

      const tagNodes = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });

  describe('Declarative API', () => {
    it('updates base tag', () => {
      render(
        <Helmet>
          <base href="http://mysite.com/" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(tag => tag.getAttribute('href') === 'http://mysite.com/');

      expect(filteredTags).toHaveLength(1);
    });

    it('clears the base tag if one is not specified', () => {
      render(<Helmet base={{ href: 'http://mysite.com/' }} />);
      render(<Helmet />);

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' are not accepted", () => {
      render(
        <Helmet>
          <base property="won't work" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it('sets base tag based on deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <base href="http://mysite.com" />
          </Helmet>
          <Helmet>
            <base href="http://mysite.com/public" />
          </Helmet>
        </div>
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const firstTag = [].slice.call(existingTags)[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://mysite.com/public');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet>
          <base href={undefined} />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toHaveLength(0);
    });
  });
});
