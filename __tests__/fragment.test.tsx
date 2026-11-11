import React from 'react';

import { Helmet } from '../src';
import { HELMET_ATTRIBUTE } from '../src/constants';

import { render } from './utils';

// TODO: This is confusing
Helmet.defaultProps.defer = false;

const helmetTagAttributes = (tagName: string, attribute: string) =>
  [...document.head.querySelectorAll(`${tagName}[${HELMET_ATTRIBUTE}]`)].map((tag) =>
    tag.getAttribute(attribute)
  );

describe('fragments', () => {
  it('parses Fragments', () => {
    const title = 'Hello';
    render(
      <Helmet>
        <>
          <title>{title}</title>
          <meta charSet="utf-8" />
        </>
      </Helmet>
    );

    expect(document.title).toBe(title);
  });

  it('parses nested Fragments', () => {
    const title = 'Baz';
    render(
      <Helmet>
        <>
          <title>Foo</title>
          <>
            <title>Bar</title>
            <title>{title}</title>
          </>
        </>
      </Helmet>
    );

    expect(document.title).toBe(title);
  });

  it('keeps tags from several Fragments and sibling tags', () => {
    render(
      <Helmet>
        <meta name="a" content="1" />
        <link rel="stylesheet" href="/a.css" />
        <>
          <meta name="b" content="2" />
          <link rel="stylesheet" href="/b.css" />
          <script src="/b.js" />
        </>
        <script src="/a.js" />
        <>
          <meta name="c" content="3" />
          <link rel="stylesheet" href="/c.css" />
          <script src="/c.js" />
        </>
      </Helmet>
    );

    expect(helmetTagAttributes('meta', 'name')).toEqual(['a', 'b', 'c']);
    expect(helmetTagAttributes('link', 'href')).toEqual(['/a.css', '/b.css', '/c.css']);
    expect(helmetTagAttributes('script', 'src')).toEqual(['/b.js', '/a.js', '/c.js']);
  });

  it('keeps tags from nested Fragments', () => {
    render(
      <Helmet>
        <meta name="a" content="1" />
        <>
          <meta name="b" content="2" />
          <>
            <meta name="c" content="3" />
            <meta name="d" content="4" />
          </>
          <meta name="e" content="5" />
        </>
      </Helmet>
    );

    expect(helmetTagAttributes('meta', 'name')).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
