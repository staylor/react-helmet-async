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
    it('provides initial values if no state is found', () => {
      const NullComponent = () => null;

      const head = renderContext(<NullComponent />);

      expect(head.meta).toBeDefined();
      expect(head.meta.toString).toBeDefined();
      expect(head.meta.toString()).toBe('');
    });

    it('encodes special characters in title', () => {
      const head = renderContext(<Helmet title="Dangerous <script> include" />);

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('opts out of string encoding', () => {
      const head = renderContext(
        <Helmet encodeSpecialCharacters={false} title={"This is text and & and '."} />
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const head = renderContext(<Helmet title="Dangerous <script> include" />);

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach((title: Element) => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title with itemprop name as React component', () => {
      const head = renderContext(
        <Helmet title="Title with Itemprop" titleAttributes={{ itemprop: 'name' }} />
      );

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach((title: Element) => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title tag as string', () => {
      const head = renderContext(<Helmet title="Dangerous <script> include" />);

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const head = renderContext(
        <Helmet title="Title with Itemprop" titleAttributes={{ itemprop: 'name' }} />
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();

      const titleString = head.title.toString();

      expect(titleString).toMatchSnapshot();
    });

    it('does not encode all characters with HTML character entity equivalents', () => {
      const chineseTitle = '膣膗 鍆錌雔';

      const head = renderContext(
        <div>
          <Helmet title={chineseTitle} />
        </div>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('encodes special characters in title', () => {
      const head = renderContext(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('opts out of string encoding', () => {
      const head = renderContext(
        <Helmet encodeSpecialCharacters={false}>
          <title>This is text and & and '.</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const head = renderContext(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach((title: Element) => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title with itemprop name as React component', () => {
      const head = renderContext(
        <Helmet>
          <title itemProp="name">Title with Itemprop</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach((title: Element) => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });

    it('renders title tag as string', () => {
      const head = renderContext(
        <Helmet>
          <title>{'Dangerous <script> include'}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title and allows children containing expressions', () => {
      const someValue = 'Some Great Title';

      const head = renderContext(
        <Helmet>
          <title>Title: {someValue}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title with itemprop name as string', () => {
      const head = renderContext(
        <Helmet>
          <title itemProp="name">Title with Itemprop</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();

      const titleString = head.title.toString();

      expect(titleString).toMatchSnapshot();
    });

    it('does not encode all characters with HTML character entity equivalents', () => {
      const chineseTitle = '膣膗 鍆錌雔';

      const head = renderContext(
        <div>
          <Helmet>
            <title>{chineseTitle}</title>
          </Helmet>
        </div>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });
  });

  describe('renderStatic', () => {
    it('does html encode title', () => {
      const head = renderContext(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toString).toBeDefined();
      expect(head.title.toString()).toMatchSnapshot();
    });

    it('renders title as React component', () => {
      const head = renderContext(
        <Helmet>
          <title>{`Dangerous <script> include`}</title>
        </Helmet>
      );

      expect(head.title).toBeDefined();
      expect(head.title.toComponent).toBeDefined();

      const titleComponent = head.title.toComponent();

      expect(titleComponent).toEqual(isArray);
      expect(titleComponent).toHaveLength(1);

      titleComponent.forEach((title: Element) => {
        expect(title).toEqual(expect.objectContaining({ type: 'title' }));
      });

      const markup = ReactServer.renderToStaticMarkup(titleComponent);

      expect(markup).toMatchSnapshot();
    });
  });
});
