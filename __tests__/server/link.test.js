import React from 'react';
import ReactServer from 'react-dom/server';
import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { render } from './utils';

Helmet.defaultProps.defer = false;

beforeAll(() => {
  Provider.canUseDOM = false;
});

afterAll(() => {
  Provider.canUseDOM = true;
});

const isArray = {
  asymmetricMatch: actual => Array.isArray(actual),
};

describe('server', () => {
  describe('API', () => {
    it('renders link tags as React components', () => {
      const context = {};
      render(
        <Helmet
          link={[
            { href: 'http://localhost/helmet', rel: 'canonical' },
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.link).toBeDefined();
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toEqual(isArray);
      expect(linkComponent).toHaveLength(2);

      linkComponent.forEach(link => {
        expect(link).toEqual(expect.objectContaining({ type: 'link' }));
      });

      const markup = ReactServer.renderToStaticMarkup(linkComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders link tags as string', () => {
      const context = {};
      render(
        <Helmet
          link={[
            { href: 'http://localhost/helmet', rel: 'canonical' },
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
        />,
        context
      );

      const head = context.helmet;

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders link tags as React components', () => {
      const context = {};
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.link).toBeDefined();
      expect(head.link.toComponent).toBeDefined();

      const linkComponent = head.link.toComponent();

      expect(linkComponent).toEqual(isArray);
      expect(linkComponent).toHaveLength(2);

      linkComponent.forEach(link => {
        expect(link).toEqual(expect.objectContaining({ type: 'link' }));
      });

      const markup = ReactServer.renderToStaticMarkup(linkComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders link tags as string', () => {
      const context = {};
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.link).toBeDefined();
      expect(head.link.toString).toBeDefined();
      expect(head.link.toString()).toMatchSnapshot();
    });
  });
});
