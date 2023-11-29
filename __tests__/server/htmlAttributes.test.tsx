import React from 'react';
import ReactServer from 'react-dom/server';

import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { renderContext } from '../utils';

Helmet.defaultProps.defer = false;

beforeAll(() => {
  Provider.canUseDOM = false;
});

afterAll(() => {
  Provider.canUseDOM = true;
});

describe('server', () => {
  describe('API', () => {
    it('renders html attributes as component', () => {
      const head = renderContext(
        <Helmet
          htmlAttributes={{
            lang: 'ga',
            className: 'myClassName',
          }}
        />
      );

      const attrs = head.htmlAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(<html lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders html attributes as string', () => {
      const head = renderContext(
        <Helmet
          htmlAttributes={{
            lang: 'ga',
            class: 'myClassName',
          }}
        />
      );

      expect(head.htmlAttributes).toBeDefined();
      expect(head.htmlAttributes.toString).toBeDefined();
      expect(head.htmlAttributes.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders html attributes as component', () => {
      const head = renderContext(
        <Helmet>
          <html lang="ga" className="myClassName" />
        </Helmet>
      );

      const attrs = head.htmlAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(<html lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders html attributes as string', () => {
      const head = renderContext(
        <Helmet>
          <html lang="ga" className="myClassName" />
        </Helmet>
      );

      expect(head.htmlAttributes).toBeDefined();
      expect(head.htmlAttributes.toString).toBeDefined();
      expect(head.htmlAttributes.toString()).toMatchSnapshot();
    });
  });
});
