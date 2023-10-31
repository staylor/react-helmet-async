import React from 'react';
import ReactServer from 'react-dom/server';

import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { renderContext, isArray } from '../utils';

Helmet.defaultProps.defer = false;

beforeAll(() => {
  Provider.canUseDOM = false;
});

afterAll(() => {
  Provider.canUseDOM = true;
});

describe('server', () => {
  describe('API', () => {
    it('renders style tags as React components', () => {
      const head = renderContext(
        <Helmet
          style={[
            {
              type: 'text/css',
              cssText: `body {background-color: green;}`,
            },
            {
              type: 'text/css',
              cssText: `p {font-size: 12px;}`,
            },
          ]}
        />
      );

      expect(head.style).toBeDefined();
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toEqual(isArray);
      expect(styleComponent).toHaveLength(2);

      const markup = ReactServer.renderToStaticMarkup(styleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders style tags as string', () => {
      const head = renderContext(
        <Helmet
          style={[
            {
              type: 'text/css',
              cssText: `body {background-color: green;}`,
            },
            {
              type: 'text/css',
              cssText: `p {font-size: 12px;}`,
            },
          ]}
        />
      );

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders style tags as React components', () => {
      const head = renderContext(
        <Helmet>
          <style type="text/css">{`body {background-color: green;}`}</style>
          <style type="text/css">{`p {font-size: 12px;}`}</style>
        </Helmet>
      );

      expect(head.style).toBeDefined();
      expect(head.style.toComponent).toBeDefined();

      const styleComponent = head.style.toComponent();

      expect(styleComponent).toEqual(isArray);
      expect(styleComponent).toHaveLength(2);

      const markup = ReactServer.renderToStaticMarkup(styleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders style tags as string', () => {
      const head = renderContext(
        <Helmet>
          <style type="text/css">{`body {background-color: green;}`}</style>
          <style type="text/css">{`p {font-size: 12px;}`}</style>
        </Helmet>
      );

      expect(head.style).toBeDefined();
      expect(head.style.toString).toBeDefined();
      expect(head.style.toString()).toMatchSnapshot();
    });
  });
});
