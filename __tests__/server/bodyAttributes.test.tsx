import React from 'react';
import ReactServer from 'react-dom/server';

import { Helmet } from '../../src';
import Provider from '../../src/Provider';
import { renderContext } from '../utils';

Helmet.defaultProps.defer = false;

describe('server', () => {
  beforeAll(() => {
    Provider.canUseDOM = false;
  });

  afterAll(() => {
    Provider.canUseDOM = true;
  });

  describe('Declarative API', () => {
    it('renders body attributes as component', () => {
      const head = renderContext(
        <Helmet>
          <body lang="ga" className="myClassName" />
        </Helmet>
      );
      const attrs = head.bodyAttributes.toComponent();

      expect(attrs).toBeDefined();

      const markup = ReactServer.renderToStaticMarkup(<body lang="en" {...attrs} />);

      expect(markup).toMatchSnapshot();
    });

    it('renders body attributes as string', () => {
      const body = renderContext(
        <Helmet>
          <body lang="ga" className="myClassName" />
        </Helmet>
      );

      expect(body.bodyAttributes).toBeDefined();
      expect(body.bodyAttributes.toString).toBeDefined();
      expect(body.bodyAttributes.toString()).toMatchSnapshot();
    });

    it('leaves out attributes set to false or null, as React does', () => {
      const head = renderContext(
        <Helmet>
          <body
            hidden={false}
            // @ts-expect-error -- null on purpose
            dir={null}
            spellCheck={false}
            data-menu-open={false}
            data-count={0}
          />
        </Helmet>
      );

      expect(head.bodyAttributes.toString()).toBe(
        'spellCheck="false" data-menu-open="false" data-count="0"'
      );
    });
  });
});
