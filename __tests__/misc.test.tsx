import React from 'react';

import { Helmet } from '../src';
import { HELMET_ATTRIBUTE } from '../src/constants';

import { render } from './utils';

// TODO: This is confusing
Helmet.defaultProps.defer = false;

describe('misc', () => {
  describe('API', () => {
    it('encodes special characters', () => {
      render(
        <Helmet
          meta={[
            {
              name: 'description',
              content: 'This is "quoted" text and & and \'.',
            },
          ]}
        />
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag).toHaveAttribute('name', 'description');
      expect(existingTag).toHaveAttribute('content', 'This is "quoted" text and & and \'.');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not change the DOM if it recevies identical props', () => {
      const onChange = vi.fn();

      render(
        <Helmet
          meta={[{ name: 'description', content: 'Test description' }]}
          title="Test Title"
          onChangeClientState={onChange}
        />
      );

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet
          meta={[{ name: 'description', content: 'Test description' }]}
          title="Test Title"
          onChangeClientState={onChange}
        />
      );

      expect(onChange).toBeCalledTimes(1);
    });

    it('does not write the DOM if the client and server are identical', () => {
      document.head.innerHTML = `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript" />`;

      const onChange = vi.fn();
      render(
        <Helmet
          script={[
            {
              src: 'http://localhost/test.js',
              type: 'text/javascript',
            },
          ]}
          onChangeClientState={onChange}
        />
      );

      expect(onChange).toHaveBeenCalled();

      const [, addedTags, removedTags] = onChange.mock.calls[0];

      expect(addedTags).toEqual({});
      expect(removedTags).toEqual({});
    });

    it('only adds new tags and preserves tags when rendering additional Helmet instances', () => {
      const onChange = vi.fn();
      let addedTags;
      let removedTags;
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
          meta={[{ name: 'description', content: 'Test description' }]}
          onChangeClientState={onChange}
        />
      );

      expect(onChange).toHaveBeenCalled();

      addedTags = onChange.mock.calls[0][1];
      removedTags = onChange.mock.calls[0][2];

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).toEqual({});

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
            {
              href: 'http://localhost/style2.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
          meta={[{ name: 'description', content: 'New description' }]}
          onChangeClientState={onChange}
        />
      );

      expect(onChange).toBeCalledTimes(2);

      addedTags = onChange.mock.calls[1][1];
      removedTags = onChange.mock.calls[1][2];

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).toHaveProperty('metaTags');
      expect(removedTags.metaTags[0]).toBeDefined();
      expect(removedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).not.toHaveProperty('linkTags');
    });

    it('does not accept nested Helmets', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet title="Test Title">
            <Helmet title={"Title you'll never see"} />
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        'You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('recognizes valid tags regardless of attribute ordering', () => {
      render(<Helmet meta={[{ content: 'Test Description', name: 'description' }]} />);

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag).toHaveAttribute('name', 'description');
      expect(existingTag).toHaveAttribute('content', 'Test Description');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('requestAnimationFrame works as expected', () => {
      return new Promise(resolve => {
        requestAnimationFrame(cb => {
          expect(cb).toBeDefined();
          expect(typeof cb).toBe('number');

          resolve(true);
        });
      });
    });
  });

  describe('Declarative API', () => {
    it('encodes special characters', () => {
      render(
        <Helmet>
          <meta name="description" content={'This is "quoted" text and & and \'.'} />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);
      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag).toHaveAttribute('name', 'description');
      expect(existingTag).toHaveAttribute('content', 'This is "quoted" text and & and \'.');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not change the DOM if it recevies identical props', () => {
      const onChange = vi.fn();
      render(
        <Helmet onChangeClientState={onChange}>
          <meta name="description" content="Test description" />
          <title>Test Title</title>
        </Helmet>
      );

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet onChangeClientState={onChange}>
          <meta name="description" content="Test description" />
          <title>Test Title</title>
        </Helmet>
      );

      expect(onChange).toBeCalledTimes(1);
    });

    it('does not write the DOM if the client and server are identical', () => {
      document.head.innerHTML = `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript" />`;

      const onChange = vi.fn();
      render(
        <Helmet onChangeClientState={onChange}>
          <script src="http://localhost/test.js" type="text/javascript" />
        </Helmet>
      );

      expect(onChange).toHaveBeenCalled();

      const [, addedTags, removedTags] = onChange.mock.calls[0];

      expect(addedTags).toEqual({});
      expect(removedTags).toEqual({});
    });

    it('only adds new tags and preserves tags when rendering additional Helmet instances', () => {
      const onChange = vi.fn();
      let addedTags;
      let removedTags;

      render(
        <Helmet onChangeClientState={onChange}>
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
          <meta name="description" content="Test description" />
        </Helmet>
      );

      expect(onChange).toHaveBeenCalled();

      addedTags = onChange.mock.calls[0][1];
      removedTags = onChange.mock.calls[0][2];

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).toEqual({});

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet onChangeClientState={onChange}>
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
          <link href="http://localhost/style2.css" rel="stylesheet" type="text/css" />
          <meta name="description" content="New description" />
        </Helmet>
      );

      expect(onChange).toBeCalledTimes(2);

      addedTags = onChange.mock.calls[1][1];
      removedTags = onChange.mock.calls[1][2];

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags.metaTags[0]).toBeDefined();
      expect(addedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags.linkTags[0]).toBeDefined();
      expect(addedTags.linkTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).toHaveProperty('metaTags');
      expect(removedTags.metaTags[0]).toBeDefined();
      expect(removedTags.metaTags[0].outerHTML).toMatchSnapshot();
      expect(removedTags).not.toHaveProperty('linkTags');
    });

    it('does not accept nested Helmets', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet>
            <title>Test Title</title>
            <Helmet>
              <title>Title you will never see</title>
            </Helmet>
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        'You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('throws on invalid elements', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet>
            <title>Test Title</title>
            <div>
              <title>Title you will never see</title>
            </div>
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        'Only elements types base, body, head, html, link, meta, noscript, script, style, title, Symbol(react.fragment) are allowed. Helmet does not support rendering <div> elements. Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('throws on invalid self-closing elements', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet>
            <title>Test Title</title>
            <div
              // @ts-ignore
              customAttribute
            />
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        'Only elements types base, body, head, html, link, meta, noscript, script, style, title, Symbol(react.fragment) are allowed. Helmet does not support rendering <div> elements. Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('throws on invalid strings as children', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet>
            <title>Test Title</title>
            <link href="http://localhost/helmet" rel="canonical">
              test
            </link>
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        '<link /> elements are self-closing and can not contain children. Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('throws on invalid children', () => {
      const consoleError = global.console.error;
      global.console.error = vi.fn();

      const renderInvalid = () => {
        render(
          <Helmet>
            <title>Test Title</title>
            <script>
              <title>Title you will never see</title>
            </script>
          </Helmet>
        );
      };

      expect(renderInvalid).toThrow(
        'Helmet expects a string as a child of <script>. Did you forget to wrap your children in braces? ( <script>{``}</script> ) Refer to our API for more information.'
      );

      global.console.error = consoleError;
    });

    it('handles undefined children', () => {
      const charSet = undefined;

      render(
        <Helmet>
          {charSet && <meta charSet={charSet} />}
          <title>Test Title</title>
        </Helmet>
      );

      expect(document.title).toBe('Test Title');
    });

    it('recognizes valid tags regardless of attribute ordering', () => {
      render(
        <Helmet>
          <meta content="Test Description" name="description" />
        </Helmet>
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);
      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag).toHaveAttribute('name', 'description');
      expect(existingTag).toHaveAttribute('content', 'Test Description');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('requestAnimationFrame works as expected', () => {
      return new Promise(resolve => {
        requestAnimationFrame(cb => {
          expect(cb).toBeDefined();
          expect(typeof cb).toBe('number');
          resolve(true);
        });
      });
    });
  });
});
