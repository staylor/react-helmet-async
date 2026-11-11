import React, { Component } from 'react';

import { isDocument } from './HelmetData';
import { TAG_NAMES, HTML_TAG_MAP, REACT_TAG_MAP } from './constants';
import type { Attributes, HelmetProps } from './types';
import { reducePropsToState } from './utils';

// Module-level registry of all mounted React19Dispatcher instances, in mount
// order, so later instances count as inner ones as on React 16–18. Every
// instance renders from the merged props of all of them, and unmounting one
// instance falls back to the outer instances' tags and html/body attributes.
const react19Instances: React19Dispatcher[] = [];

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

/**
 * Merges html/body attributes from all registered instances (earlier instances
 * are overridden by later ones for conflicting keys, matching the legacy
 * reducePropsToState behavior) and applies the result to the DOM.
 */
const syncAllAttributes = () => {
  const htmlAttrs: { [key: string]: any } = {};
  const bodyAttrs: { [key: string]: any } = {};

  for (const instance of react19Instances) {
    const { htmlAttributes, bodyAttributes } = instance.props;
    if (htmlAttributes) {
      Object.assign(htmlAttrs, toHtmlAttributes(htmlAttributes));
    }
    if (bodyAttributes) {
      Object.assign(bodyAttrs, toHtmlAttributes(bodyAttributes));
    }
  }

  applyAttributes(TAG_NAMES.HTML, htmlAttrs);
  applyAttributes(TAG_NAMES.BODY, bodyAttrs);
};

/**
 * Re-renders every registered instance against the merged props and applies
 * the merged html/body attributes.
 */
const syncAllInstances = () => {
  for (const instance of react19Instances) {
    instance.forceUpdate();
  }
  syncAllAttributes();
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
 * Each instance merges the props of all mounted instances with
 * reducePropsToState, like the React 16–18 path: the innermost instance renders
 * the title, and every other winning tag is rendered once, by the innermost
 * instance that was given it. React itself loads an async <script src>, or a
 * stylesheet with precedence, once per URL and keeps the props it got first,
 * so for those the outer instance's attributes stay.
 *
 * For htmlAttributes and bodyAttributes, we still apply via direct DOM
 * manipulation since React 19 doesn't handle those.
 */
export default class React19Dispatcher extends Component<React19DispatcherProps> {
  componentDidMount() {
    react19Instances.push(this);
    syncAllInstances();
  }

  componentDidUpdate(prevProps: React19DispatcherProps) {
    // Re-renders from syncAllInstances keep their props; only new props change
    // what the other instances render.
    if (prevProps !== this.props) {
      syncAllInstances();
    }
  }

  componentWillUnmount() {
    const index = react19Instances.indexOf(this);
    if (index !== -1) {
      react19Instances.splice(index, 1);
    }
    syncAllInstances();
  }

  renderTitle(title: string | undefined, titleAttributes: Attributes) {
    if (title === undefined) return null;

    return React.createElement(TAG_NAMES.TITLE, toReactProps(titleAttributes), title);
  }

  renderBase(tags: Set<unknown>) {
    const { base } = this.props;
    if (!base || !tags.has(base)) return null;
    return React.createElement(TAG_NAMES.BASE, toReactProps(base));
  }

  renderMeta(tags: Set<unknown>) {
    const { meta } = this.props;
    if (!meta || !Array.isArray(meta)) return null;
    return meta.map(
      (attrs, i: number) =>
        tags.has(attrs) &&
        React.createElement(TAG_NAMES.META, {
          key: i,
          ...toReactProps(attrs as Record<string, string>),
        })
    );
  }

  renderLink(tags: Set<unknown>) {
    const { link } = this.props;
    if (!link || !Array.isArray(link)) return null;
    return link.map(
      (attrs, i: number) =>
        tags.has(attrs) &&
        React.createElement(TAG_NAMES.LINK, {
          key: i,
          ...toReactProps(attrs as Record<string, string>),
        })
    );
  }

  renderScript(tags: Set<unknown>) {
    const { script } = this.props;
    if (!script || !Array.isArray(script)) return null;
    return script.map((attrs, i: number) => {
      if (!tags.has(attrs)) return null;
      const { innerHTML, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React.createElement(TAG_NAMES.SCRIPT, { key: i, ...props });
    });
  }

  renderStyle(tags: Set<unknown>) {
    const { style } = this.props;
    if (!style || !Array.isArray(style)) return null;
    return style.map((attrs, i: number) => {
      if (!tags.has(attrs)) return null;
      const { cssText, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (cssText) {
        props.dangerouslySetInnerHTML = { __html: cssText };
      }
      return React.createElement(TAG_NAMES.STYLE, { key: i, ...props });
    });
  }

  renderNoscript(tags: Set<unknown>) {
    const { noscript } = this.props;
    if (!noscript || !Array.isArray(noscript)) return null;
    return noscript.map((attrs, i: number) => {
      if (!tags.has(attrs)) return null;
      const { innerHTML, ...rest } = attrs;
      const props: Record<string, unknown> = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React.createElement(TAG_NAMES.NOSCRIPT, { key: i, ...props });
    });
  }

  render() {
    // Until it mounts (and always on the server), an instance merges itself in
    // as the innermost one.
    const instances = react19Instances.includes(this)
      ? react19Instances
      : [...react19Instances, this];
    const state = reducePropsToState(instances.map((instance) => instance.props));
    const tags = new Set<unknown>([
      ...state.baseTag,
      ...state.linkTags,
      ...state.metaTags,
      ...state.noscriptTags,
      ...state.scriptTags,
      ...state.styleTags,
    ]);
    // A tag object given to several instances is rendered by the innermost one.
    for (const { props } of instances.slice(instances.indexOf(this) + 1)) {
      const { base, link, meta, noscript, script, style } = props;
      for (const tag of [base, link, meta, noscript, script, style].flat()) {
        tags.delete(tag);
      }
    }

    return React.createElement(
      React.Fragment,
      null,
      instances[instances.length - 1] === this &&
        this.renderTitle(state.title, state.titleAttributes),
      this.renderBase(tags),
      this.renderMeta(tags),
      this.renderLink(tags),
      this.renderScript(tags),
      this.renderStyle(tags),
      this.renderNoscript(tags)
    );
  }
}
