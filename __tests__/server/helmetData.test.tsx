import React from 'react';

import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import HelmetData from '../../src/HelmetData';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from '../utils';

Helmet.defaultProps.defer = false;

describe('Helmet Data', () => {
  describe('server', () => {
    beforeAll(() => {
      Provider.canUseDOM = false;
    });

    afterAll(() => {
      Provider.canUseDOM = true;
    });

    it('renders without context', () => {
      const helmetData = new HelmetData({});

      render(
        <Helmet helmetData={helmetData} base={{ target: '_blank', href: 'http://localhost/' }} />
      );

      const head = helmetData.context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });

    it('renders declarative without context', () => {
      const helmetData = new HelmetData({});

      render(
        <Helmet helmetData={helmetData}>
          <base target="_blank" href="http://localhost/" />
        </Helmet>
      );

      const head = helmetData.context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });

    it('sets base tag based on deepest nested component', () => {
      const helmetData = new HelmetData({});

      render(
        <div>
          <Helmet helmetData={helmetData}>
            <base href="http://mysite.com" />
          </Helmet>
          <Helmet helmetData={helmetData}>
            <base href="http://mysite.com/public" />
          </Helmet>
        </div>
      );

      const head = helmetData.context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });

    it('works with the same context object but separate HelmetData instances', () => {
      const context = {} as any;

      render(
        <div>
          <Helmet helmetData={new HelmetData(context)}>
            <base href="http://mysite.com" />
          </Helmet>
          <Helmet helmetData={new HelmetData(context)}>
            <base href="http://mysite.com/public" />
          </Helmet>
        </div>
      );

      const head = context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });
  });

  describe('browser', () => {
    it('renders without context', () => {
      const helmetData = new HelmetData({});

      render(
        <Helmet helmetData={helmetData} base={{ target: '_blank', href: 'http://localhost/' }} />
      );

      const existingTags = [...document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('renders declarative without context', () => {
      const helmetData = new HelmetData({});

      render(
        <Helmet helmetData={helmetData}>
          <base target="_blank" href="http://localhost/" />
        </Helmet>
      );

      const existingTags = [...document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://localhost/');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('sets base tag based on deepest nested component', () => {
      const helmetData = new HelmetData({});

      render(
        <div>
          <Helmet helmetData={helmetData}>
            <base href="http://mysite.com" />
          </Helmet>
          <Helmet helmetData={helmetData}>
            <base href="http://mysite.com/public" />
          </Helmet>
        </div>
      );

      const existingTags = [...document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`)];
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag).toHaveAttribute('href', 'http://mysite.com/public');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });
});
