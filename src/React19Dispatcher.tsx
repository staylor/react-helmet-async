import React, { Component } from 'react';

import { TAG_NAMES, HTML_TAG_MAP, REACT_TAG_MAP } from './constants';
import { isDocument } from './HelmetData';
import type { HelmetProps } from './types';

/**
 * Converts React-style prop names to HTML attribute names.
 * e.g. { className: 'foo' } → { class: 'foo' }
 */
const toHtmlAttributes = (props: { [key: string]: any }): { [key: string]: any } => {
  const result: { [key: string]: any } = {};
  for (const key of Object.keys(props)) {
    result[HTML_TAG_MAP[key] || key] = props[key];
  }
  return result;
};

/**
 * Converts HTML attribute names to React-style prop names.
 * e.g. { 'http-equiv': 'X-UA-Compatible' } → { httpEquiv: 'X-UA-Compatible' }
 */
const toReactProps = (attrs: { [key: string]: any }): { [key: string]: any } => {
  const result: { [key: string]: any } = {};
  for (const key of Object.keys(attrs)) {
    const mapped = (REACT_TAG_MAP as { [key: string]: string })[key];
    result[mapped || key] = attrs[key];
  }
  return result;
};

/**
 * Applies attributes directly to a DOM element (for html/body which React 19
 * does not hoist).
 */
const applyAttributes = (tagName: string, attributes: { [key: string]: any }) => {
  if (!isDocument) return;
  const el = document.getElementsByTagName(tagName)[0];
  if (!el) return;

  // Track attributes we manage
  const managedAttr = 'data-rh-managed';
  const prev = el.getAttribute(managedAttr);
  const prevKeys = prev ? prev.split(',') : [];

  const nextKeys = Object.keys(attributes);

  // Remove old attributes that are no longer present
  for (const key of prevKeys) {
    if (!nextKeys.includes(key)) {
      el.removeAttribute(key);
    }
  }

  // Set new attributes
  for (const key of nextKeys) {
    const value = attributes[key];
    if (value === undefined || value === null || value === false) {
      el.removeAttribute(key);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }

  if (nextKeys.length > 0) {
    el.setAttribute(managedAttr, nextKeys.join(','));
  } else {
    el.removeAttribute(managedAttr);
  }
};

interface React19DispatcherProps extends HelmetProps {
  /**
   * The processed props including mapped children. These come from Helmet's
   * mapChildrenToProps or the raw API props.
   */
  [key: string]: any;
}

/**
 * React 19+ Dispatcher: Instead of manual DOM manipulation, this component
 * renders actual JSX elements. React 19 automatically hoists <title>, <meta>,
 * <link>, <style>, and <script async> to <head>.
 *
 * For htmlAttributes and bodyAttributes, we still apply via direct DOM
 * manipulation since React 19 doesn't handle those.
 */
export default class React19Dispatcher extends Component<React19DispatcherProps> {
  componentDidMount() {
    this.applyNonHostedAttributes();
  }

  componentDidUpdate() {
    this.applyNonHostedAttributes();
  }

  componentWillUnmount() {
    // Clean up html/body attributes
    applyAttributes(TAG_NAMES.HTML, {});
    applyAttributes(TAG_NAMES.BODY, {});
  }

  applyNonHostedAttributes() {
    const { htmlAttributes, bodyAttributes } = this.props;
    if (htmlAttributes) {
      applyAttributes(TAG_NAMES.HTML, toHtmlAttributes(htmlAttributes));
    }
    if (bodyAttributes) {
      applyAttributes(TAG_NAMES.BODY, toHtmlAttributes(bodyAttributes));
    }
  }

  resolveTitle(): string | undefined {
    const { title, titleTemplate, defaultTitle } = this.props;
    if (title && titleTemplate) {
      return titleTemplate.replace(/%s/g, () => (Array.isArray(title) ? title.join('') : title));
    }
    return title || defaultTitle || undefined;
  }

  renderTitle() {
    const title = this.resolveTitle();
    if (title === undefined) return null;

    const titleAttributes = this.props.titleAttributes || {};
    return React.createElement(TAG_NAMES.TITLE, toReactProps(titleAttributes), title);
  }

  renderBase() {
    const { base } = this.props;
    if (!base) return null;
    return React.createElement(TAG_NAMES.BASE, toReactProps(base));
  }

  renderMeta() {
    const { meta } = this.props;
    if (!meta || !Array.isArray(meta)) return null;
    return meta.map((attrs, i: number) =>
      React.createElement(TAG_NAMES.META, {
        key: i,
        ...toReactProps(attrs as Record<string, string>),
      })
    );
  }

  renderLink() {
    const { link } = this.props;
    if (!link || !Array.isArray(link)) return null;
    return link.map((attrs, i: number) =>
      React.createElement(TAG_NAMES.LINK, {
        key: i,
        ...toReactProps(attrs as Record<string, string>),
      })
    );
  }

  renderScript() {
    const { script } = this.props;
    if (!script || !Array.isArray(script)) return null;
    return script.map((attrs, i: number) => {
      const { innerHTML, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React.createElement(TAG_NAMES.SCRIPT, { key: i, ...props });
    });
  }

  renderStyle() {
    const { style } = this.props;
    if (!style || !Array.isArray(style)) return null;
    return style.map((attrs, i: number) => {
      const { cssText, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (cssText) {
        props.dangerouslySetInnerHTML = { __html: cssText };
      }
      return React.createElement(TAG_NAMES.STYLE, { key: i, ...props });
    });
  }

  renderNoscript() {
    const { noscript } = this.props;
    if (!noscript || !Array.isArray(noscript)) return null;
    return noscript.map((attrs, i: number) => {
      const { innerHTML, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React.createElement(TAG_NAMES.NOSCRIPT, { key: i, ...props });
    });
  }

  render() {
    return React.createElement(
      React.Fragment,
      null,
      this.renderTitle(),
      this.renderBase(),
      this.renderMeta(),
      this.renderLink(),
      this.renderScript(),
      this.renderStyle(),
      this.renderNoscript()
    );
  }
}
