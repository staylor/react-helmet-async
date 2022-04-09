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
    it('provides initial values if no state is found', () => {
      const context = {};
      const NullComponent = () => null;
      render(<NullComponent />, context);
      const head = context.helmet;

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
    });

    it('encodes special characters in title', () => {
      const context = {};
      render(<Helmet title="Dangerous <script> include" />, context);
      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('opts out of string encoding', () => {
      const context = {};
      render(
        <Helmet encodeSpecialCharacters={false} title={"This is text and & and '."} />,
        context
      );
      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context = {};
      render(<Helmet title="Dangerous <script> include" />, context);
      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach(title => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title with itemprop name as React component', () => {
      const context = {};
      render(
        <Helmet title="Title with Itemprop" titleAttributes={{ itemprop: 'name' }} />,
        context
      );
      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach(title => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title tag as string', () => {
      const context = {};
      render(<Helmet title="Dangerous <script> include" />, context);

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const context = {};
      render(
        <Helmet title="Title with Itemprop" titleAttributes={{ itemprop: 'name' }} />,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();

      const titleString = head.title.toString();

      expect(titleString).toMatchSnapshot();
    });

    it('does not encode all characters with HTML character entity equivalents', () => {
      const context = {};
      const chineseTitle = '膣膗 鍆錌雔';

      render(
        <div>
          <Helmet title={chineseTitle} />
        </div>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('encodes special characters in title', () => {
      const context = {};
      render(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('opts out of string encoding', () => {
      const context = {};
      /* eslint-disable react/no-unescaped-entities */
      render(
        <Helmet encodeSpecialCharacters={false}>
          <title>This is text and & and '.</title>
        </Helmet>,
        context
      );
      /* eslint-enable react/no-unescaped-entities */

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context = {};
      render(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach(title => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title with itemprop name as React component', () => {
      const context = {};
      render(
        <Helmet>
          <title itemProp="name">Title with Itemprop</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach(title => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title tag as string', () => {
      const context = {};
      render(
        <Helmet>
          <title>{'Dangerous <script> include'}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title and allows children containing expressions', () => {
      const context = {};
      const someValue = 'Some Great Title';

      render(
        <Helmet>
          <title>Title: {someValue}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const context = {};
      render(
        <Helmet>
          <title itemProp="name">Title with Itemprop</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();

      const titleString = head.title.toString();

      expect(titleString).toMatchSnapshot();
    });

    it('does not encode all characters with HTML character entity equivalents', () => {
      const context = {};
      const chineseTitle = '膣膗 鍆錌雔';

      render(
        <div>
          <Helmet>
            <title>{chineseTitle}</title>
          </Helmet>
        </div>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });
  });

  describe('renderStatic', () => {
    it('does html encode title', () => {
      const context = {};
      render(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const context = {};
      render(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>,
        context
      );

      const head = context.helmet;

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach(title => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });
  });
});
