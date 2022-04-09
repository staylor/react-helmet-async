import React from 'react';
import { Helmet } from '../../src';
import { HELMET_ATTRIBUTE } from '../../src/constants';
import { render } from './utils';

Helmet.defaultProps.defer = false;

describe('style tags', () => {
  it('updates style tags', () => {
    const cssText1 = `
                  body {
                      background-color: green;
                  }
              `;
    const cssText2 = `
                  p {
                      font-size: 12px;
                  }
              `;
    render(
      <Helmet
        style={[
          {
            type: 'text/css',
            cssText: cssText1,
          },
          {
            cssText: cssText2,
          },
        ]}
      />
    );

    const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
    const existingTags = [].slice.call(tagNodes);

    const [firstTag, secondTag] = existingTags;

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(2);

    expect(firstTag).toBeInstanceOf(Element);
    expect(firstTag.getAttribute).toBeDefined();
    expect(firstTag.getAttribute('type')).toBe('text/css');
    expect(firstTag.innerHTML).toEqual(cssText1);
    expect(firstTag.outerHTML).toMatchSnapshot();

    expect(secondTag).toBeInstanceOf(Element);
    expect(secondTag.innerHTML).toEqual(cssText2);
    expect(secondTag.outerHTML).toMatchSnapshot();
  });

  it('clears all style tags if none are specified', () => {
    const cssText = `
                  body {
                      background-color: green;
                  }
              `;
    render(
      <Helmet
        style={[
          {
            type: 'text/css',
            cssText,
          },
        ]}
      />
    );

    render(<Helmet />);

    const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(0);
  });

  it("tags without 'cssText' are not accepted", () => {
    render(<Helmet style={[{ property: "won't work" }]} />);

    const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(0);
  });

  it('does not render tag when primary attribute is null', () => {
    render(
      <Helmet
        style={[
          {
            cssText: undefined,
          },
        ]}
      />
    );

    const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
    const existingTags = [].slice.call(tagNodes);

    expect(existingTags).toHaveLength(0);
  });
});

describe('Declarative API', () => {
  it('updates style tags', () => {
    const cssText1 = `
            body {
                background-color: green;
            }
        `;
    const cssText2 = `
            p {
                font-size: 12px;
            }
        `;

    render(
      <Helmet>
        <style type="text/css">{cssText1}</style>
        <style>{cssText2}</style>
      </Helmet>
    );

    const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
    const existingTags = [].slice.call(tagNodes);

    const [firstTag, secondTag] = existingTags;

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(2);

    expect(firstTag).toBeInstanceOf(Element);
    expect(firstTag.getAttribute).toBeDefined();
    expect(firstTag.getAttribute('type')).toBe('text/css');
    expect(firstTag.innerHTML).toEqual(cssText1);
    expect(firstTag.outerHTML).toMatchSnapshot();

    expect(secondTag).toBeInstanceOf(Element);
    expect(secondTag.innerHTML).toEqual(cssText2);
    expect(secondTag.outerHTML).toMatchSnapshot();
  });

  it('clears all style tags if none are specified', () => {
    const cssText = `
            body {
                background-color: green;
            }
        `;
    render(
      <Helmet>
        <style type="text/css">{cssText}</style>
      </Helmet>
    );

    render(<Helmet />);

    const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(0);
  });

  it("tags without 'cssText' are not accepted", () => {
    render(
      <Helmet>
        <style property="won't work" />
      </Helmet>
    );

    const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

    expect(existingTags).toBeDefined();
    expect(existingTags).toHaveLength(0);
  });

  it('does not render tag when primary attribute is null', () => {
    render(
      <Helmet>
        <style>{undefined}</style>
      </Helmet>
    );

    const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
    const existingTags = [].slice.call(tagNodes);

    expect(existingTags).toHaveLength(0);
  });
});
