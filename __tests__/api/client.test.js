import React from 'react';
import { render } from './utils';

describe('onChangeClientState', () => {
  window.requestAnimationFrame = fn => setTimeout(fn, 0);

  const Helmet = require('../../src').default; // eslint-disable-line global-require
  Helmet.defaultProps.defer = false;

  describe('API', () => {
    it('when handling client state change, calls the function with new state, addedTags and removedTags ', () => {
      const onChange = jest.fn();
      render(
        <div>
          <Helmet
            base={{ href: 'http://mysite.com/' }}
            link={[
              {
                href: 'http://localhost/helmet',
                rel: 'canonical',
              },
            ]}
            meta={[{ charset: 'utf-8' }]}
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
            ]}
            title="Main Title"
            onChangeClientState={onChange}
          />
        </div>
      );

      expect(onChange).toBeCalled();
      const newState = onChange.mock.calls[0][0];
      const addedTags = onChange.mock.calls[0][1];
      const removedTags = onChange.mock.calls[0][2];

      expect(newState).toEqual(expect.objectContaining({ title: 'Main Title' }));
      expect(newState.baseTag[0]).toEqual(
        expect.objectContaining({
          href: 'http://mysite.com/',
        })
      );
      expect(newState.metaTags[0]).toEqual(expect.objectContaining({ charset: 'utf-8' }));
      expect(newState.linkTags[0]).toEqual(
        expect.objectContaining({
          href: 'http://localhost/helmet',
          rel: 'canonical',
        })
      );
      expect(newState.scriptTags[0]).toEqual(
        expect.objectContaining({
          src: 'http://localhost/test.js',
          type: 'text/javascript',
        })
      );

      expect(addedTags.baseTag).toBeDefined();
      expect(addedTags.baseTag[0]).toBeDefined();
      expect(addedTags.baseTag[0].outerHTML).toMatchSnapshot();

      expect(addedTags.metaTags).toBeDefined();
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();

      expect(addedTags.linkTags).toBeDefined();
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();

      expect(addedTags.scriptTags).toBeDefined();
      expect(addedTags.scriptTags[0]).toBeDefined();
      expect(addedTags.scriptTags[0].outerHTML).toMatchSnapshot();

      expect(removedTags).toEqual({});
    });

    it('calls the deepest defined callback with the deepest state', () => {
      const onChange = jest.fn();
      render(
        <div>
          <Helmet defer title="Main Title" onChangeClientState={onChange} />
          <Helmet defer title="Deeper Title" />
        </div>
      );

      expect(onChange).toBeCalled();

      expect(onChange.mock.calls).toHaveLength(1);
      expect(onChange.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          title: 'Deeper Title',
        })
      );
    });
  });

  describe('Declarative API', () => {
    it('when handling client state change, calls the function with new state, addedTags and removedTags ', () => {
      const onChange = jest.fn();
      render(
        <div>
          <Helmet onChangeClientState={onChange}>
            <base href="http://mysite.com/" />
            <link href="http://localhost/helmet" rel="canonical" />
            <meta charSet="utf-8" />
            <script src="http://localhost/test.js" type="text/javascript" />
            <title>Main Title</title>
          </Helmet>
        </div>
      );

      expect(onChange).toBeCalled();
      const newState = onChange.mock.calls[0][0];
      const addedTags = onChange.mock.calls[0][1];
      const removedTags = onChange.mock.calls[0][2];

      expect(newState).toEqual(expect.objectContaining({ title: 'Main Title' }));
      expect(newState.baseTag[0]).toEqual(
        expect.objectContaining({
          href: 'http://mysite.com/',
        })
      );
      expect(newState.metaTags[0]).toEqual(expect.objectContaining({ charset: 'utf-8' }));
      expect(newState.linkTags[0]).toEqual(
        expect.objectContaining({
          href: 'http://localhost/helmet',
          rel: 'canonical',
        })
      );
      expect(newState.scriptTags[0]).toEqual(
        expect.objectContaining({
          src: 'http://localhost/test.js',
          type: 'text/javascript',
        })
      );

      expect(addedTags.baseTag).toBeDefined();
      expect(addedTags.baseTag[0]).toBeDefined();
      expect(addedTags.baseTag[0].outerHTML).toMatchSnapshot();

      expect(addedTags.metaTags).toBeDefined();
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();

      expect(addedTags.linkTags).toBeDefined();
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();

      expect(addedTags.scriptTags).toBeDefined();
      expect(addedTags.scriptTags[0]).toBeDefined();
      expect(addedTags.scriptTags[0].outerHTML).toMatchSnapshot();

      expect(removedTags).toEqual({});
    });
  });

  it('calls the deepest defined callback with the deepest state', () => {
    const onChange = jest.fn();
    render(
      <div>
        <Helmet defer onChangeClientState={onChange}>
          <title>Main Title</title>
        </Helmet>
        <Helmet defer>
          <title>Deeper Title</title>
        </Helmet>
      </div>
    );

    expect(onChange).toBeCalled();
    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        title: 'Deeper Title',
      })
    );
  });
});
