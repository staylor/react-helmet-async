import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import HelmetData from '../../src/HelmetData';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

const render = node => {
  const mount = document.getElementById('mount');

  ReactDOM.render(<StrictMode>{node}</StrictMode>, mount);
};

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
      const context = {};

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

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const firstTag = [].slice.call(existingTags)[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://localhost/');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('renders declarative without context', () => {
      const helmetData = new HelmetData({});

      render(
        <Helmet helmetData={helmetData}>
          <base target="_blank" href="http://localhost/" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const firstTag = [].slice.call(existingTags)[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://localhost/');
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

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const firstTag = [].slice.call(existingTags)[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://mysite.com/public');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });
});
