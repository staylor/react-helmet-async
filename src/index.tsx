import invariant from 'invariant';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import React, { Component } from 'react';
import fastCompare from 'react-fast-compare';

import type { DispatcherContextProp } from './Dispatcher';
import Dispatcher from './Dispatcher';
import type { HelmetDataType } from './HelmetData';
import HelmetData from './HelmetData';
import { Context } from './Provider';
import React19Dispatcher from './React19Dispatcher';
import { TAG_NAMES, VALID_TAG_NAMES, HTML_TAG_MAP } from './constants';
import { isReact19 } from './reactVersion';
import type { HelmetProps } from './types';
import { without } from './utils';

export type {
  Attributes,
  BodyProps,
  HelmetDatum,
  HelmetHTMLBodyDatum,
  HelmetHTMLElementDatum,
  HelmetProps,
  HelmetServerState,
  HelmetTags,
  HtmlProps,
  LinkProps,
  MetaProps,
  StateUpdate,
  TagList,
  TitleProps,
} from './types';

export { default as HelmetData } from './HelmetData';
export { default as HelmetProvider } from './Provider';

type Props = { [key: string]: any };

const ARRAY_TAG_PROPS = [
  TAG_NAMES.META,
  TAG_NAMES.LINK,
  TAG_NAMES.SCRIPT,
  TAG_NAMES.STYLE,
  TAG_NAMES.NOSCRIPT,
];

// True when a tag object uses React attribute names that JSX children are mapped from.
const hasReactAttributeNames = (tag: Props) =>
  Boolean(tag) &&
  typeof tag === 'object' &&
  Object.keys(tag).some((key) => Object.prototype.hasOwnProperty.call(HTML_TAG_MAP, key));

export class Helmet extends Component<PropsWithChildren<HelmetProps>> {
  static defaultProps = {
    defer: true,
    encodeSpecialCharacters: true,
    prioritizeSeoTags: false,
  };

  shouldComponentUpdate(nextProps: HelmetProps) {
    return !fastCompare(without(this.props, 'helmetData'), without(nextProps, 'helmetData'));
  }

  private mapNestedChildrenToProps(child: ReactElement, nestedChildren: ReactNode) {
    if (!nestedChildren) {
      return null;
    }

    switch (child.type) {
      case TAG_NAMES.SCRIPT:
      case TAG_NAMES.NOSCRIPT:
        return {
          innerHTML: nestedChildren,
        };

      case TAG_NAMES.STYLE:
        return {
          cssText: nestedChildren,
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }

  private flattenArrayTypeChildren(
    child: JSX.Element,
    arrayTypeChildren: { [key: string]: JSX.Element[] },
    newChildProps: Props,
    nestedChildren: ReactNode
  ) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...(arrayTypeChildren[child.type] || []),
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren),
        },
      ],
    };
  }

  private mapObjectTypeChildren(
    child: JSX.Element,
    newProps: Props,
    newChildProps: Props,
    nestedChildren: ReactNode
  ) {
    switch (child.type) {
      case TAG_NAMES.TITLE:
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps },
        };

      case TAG_NAMES.BODY:
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps },
        };

      case TAG_NAMES.HTML:
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps },
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps },
        };
    }
  }

  private mapArrayTypeChildrenToProps(
    arrayTypeChildren: { [key: string]: JSX.Element },
    newProps: Props
  ) {
    let newFlattenedProps = { ...newProps };

    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName],
      };
    });

    return newFlattenedProps;
  }

  private warnOnInvalidChildren(child: JSX.Element, nestedChildren: ReactNode) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === 'function'
        ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.`
        : `Only elements types ${VALID_TAG_NAMES.join(
            ', '
          )} are allowed. Helmet does not support rendering <${
            child.type
          }> elements. Refer to our API for more information.`
    );

    invariant(
      !nestedChildren ||
        typeof nestedChildren === 'string' ||
        (Array.isArray(nestedChildren) &&
          !nestedChildren.some((nestedChild) => typeof nestedChild !== 'string')),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );

    return true;
  }

  private mapChildrenToProps(children: ReactNode, newProps: Props) {
    let arrayTypeChildren = {};

    React.Children.forEach(children as JSX.Element, (child: ReactElement) => {
      if (!child || !child.props) {
        return;
      }

      const { children: nestedChildren, ...childProps } = child.props;
      // convert React props to HTML attributes
      const newChildProps = Object.keys(childProps).reduce((obj: Props, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});

      let { type } = child;
      if (typeof type === 'symbol') {
        type = (type as 'symbol').toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }

      switch (type) {
        case TAG_NAMES.FRAGMENT:
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;

        case TAG_NAMES.LINK:
        case TAG_NAMES.META:
        case TAG_NAMES.NOSCRIPT:
        case TAG_NAMES.SCRIPT:
        case TAG_NAMES.STYLE:
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;

        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });

    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }

  render() {
    const { children, ...props } = this.props;
    let newProps: Props = { ...props };

    // Array props get the HTML attribute names that JSX children are mapped to (itemProp
    // becomes itemprop), so deduplication, SEO prioritizing and output all see one spelling.
    // Arrays and entries without React names are passed through as they are.
    for (const name of ARRAY_TAG_PROPS) {
      const tags = newProps[name];
      if (Array.isArray(tags) && tags.some(hasReactAttributeNames)) {
        newProps[name] = tags.map((tag: Props) =>
          hasReactAttributeNames(tag)
            ? Object.keys(tag).reduce((obj: Props, key) => {
                obj[HTML_TAG_MAP[key] || key] = tag[key];
                return obj;
              }, {})
            : tag
        );
      }
    }
    let { helmetData } = props;

    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }

    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData as HelmetDataType;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }

    // React 19+ natively supports hoisting <title>, <meta>, <link>, etc.
    // to <head>, so we render actual elements instead of doing DOM manipulation.
    if (isReact19) {
      return <React19Dispatcher {...newProps} />;
    }

    return helmetData ? (
      <Dispatcher {...newProps} context={helmetData.value} />
    ) : (
      <Context.Consumer>
        {(context) => {
          invariant(
            'helmetInstances' in context,
            '<Helmet> must be rendered inside a <HelmetProvider> or be given a helmetData prop. If it is, check that only one copy of react-helmet-async is bundled.'
          );

          return <Dispatcher {...newProps} context={context as DispatcherContextProp} />;
        }}
      </Context.Consumer>
    );
  }
}
