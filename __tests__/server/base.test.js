import React from 'react';
import ReactDOM from 'react-dom';
import ReactServer from 'react-dom/server';
import Helmet from '../../src';
import Provider from '../../src/Provider';

Helmet.defaultProps.defer = false;

const mount = document.getElementById('mount');

const render = (node, context = {}) => {
  ReactDOM.render(<Provider context={context}>{node}</Provider>, mount);
};

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
    it('renders base tag as React component', () => {
      const context = {};
      render(<Helmet base={{ target: '_blank', href: 'http://localhost/' }} />, context);
      const head = context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(1);

      baseComponent.forEach(base => {
        expect(base).toEqual(expect.objectContaining({ type: 'base' }));
      });

      const markup = ReactServer.renderToStaticMarkup(baseComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const context = {};
      render(<Helmet base={{ target: '_blank', href: 'http://localhost/' }} />, context);

      const head = context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('renders base tag as React component', () => {
      const context = {};
      render(
        <Helmet>
          <base target="_blank" href="http://localhost/" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toComponent).toBeDefined();

      const baseComponent = head.base.toComponent();

      expect(baseComponent).toEqual(isArray);
      expect(baseComponent).toHaveLength(1);

      baseComponent.forEach(base => {
        expect(base).toEqual(expect.objectContaining({ type: 'base' }));
      });

      const markup = ReactServer.renderToStaticMarkup(baseComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders base tags as string', () => {
      const context = {};
      render(
        <Helmet>
          <base target="_blank" href="http://localhost/" />
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.base).toBeDefined();
      expect(head.base.toString).toBeDefined();
      expect(head.base.toString()).toMatchSnapshot();
    });
  });
});
