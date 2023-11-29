import React from 'react';

import {
  HELMET_ATTRIBUTE,
  TAG_NAMES,
  REACT_TAG_MAP,
  TAG_PROPERTIES,
  ATTRIBUTE_NAMES,
  SEO_PRIORITY_TAGS,
} from './constants';
import { flattenArray, prioritizer } from './utils';
import type { MappedServerState } from './types';

const SELF_CLOSING_TAGS: string[] = [TAG_NAMES.NOSCRIPT, TAG_NAMES.SCRIPT, TAG_NAMES.STYLE];

const encodeSpecialCharacters = (str: string, encode = true) => {
  if (encode === false) {
    return String(str);
  }

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

type Attributes = { [key: string]: string | number | boolean };

const generateElementAttributesAsString = (attributes: Attributes) =>
  Object.keys(attributes).reduce((str, key) => {
    const attr = typeof attributes[key] !== 'undefined' ? `${key}="${attributes[key]}"` : `${key}`;
    return str ? `${str} ${attr}` : attr;
  }, '');

const generateTitleAsString = (
  type: string,
  title: string,
  attributes: Attributes,
  encode: boolean
) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString
    ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
        flattenedTitle,
        encode
      )}</${type}>`
    : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
        flattenedTitle,
        encode
      )}</${type}>`;
};

const generateTagsAsString = (type: string, tags: HTMLElement[], encode = true) =>
  tags.reduce((str, t) => {
    const tag = t as unknown as Attributes;
    const attributeHtml = Object.keys(tag)
      .filter(
        attribute =>
          !(attribute === TAG_PROPERTIES.INNER_HTML || attribute === TAG_PROPERTIES.CSS_TEXT)
      )
      .reduce((string, attribute) => {
        const attr =
          typeof tag[attribute] === 'undefined'
            ? attribute
            : `${attribute}="${encodeSpecialCharacters(tag[attribute] as string, encode)}"`;
        return string ? `${string} ${attr}` : attr;
      }, '');

    const tagContent = tag.innerHTML || tag.cssText || '';

    const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;

    return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${
      isSelfClosing ? `/>` : `>${tagContent}</${type}>`
    }`;
  }, '');

const convertElementAttributesToReactProps = (attributes: Attributes, initProps = {}) =>
  Object.keys(attributes).reduce((obj: Attributes, key: string) => {
    const mapped = (REACT_TAG_MAP as Attributes)[key] as string;
    obj[mapped || key] = attributes[key];
    return obj;
  }, initProps);

const generateTitleAsReactComponent = (_type: string, title: string, attributes: Attributes) => {
  // assigning into an array to define toString function on it
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true,
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);

  return [React.createElement(TAG_NAMES.TITLE, props, title)];
};

const generateTagsAsReactComponent = (type: string, tags: any[]) =>
  tags.map((tag, i) => {
    const mappedTag: { [key: string]: any } = {
      key: i,
      [HELMET_ATTRIBUTE]: true,
    };

    Object.keys(tag).forEach(attribute => {
      const mapped = (REACT_TAG_MAP as Attributes)[attribute] as string;
      const mappedAttribute = mapped || attribute;

      if (
        mappedAttribute === TAG_PROPERTIES.INNER_HTML ||
        mappedAttribute === TAG_PROPERTIES.CSS_TEXT
      ) {
        const content = tag.innerHTML || tag.cssText;
        mappedTag.dangerouslySetInnerHTML = { __html: content };
      } else {
        mappedTag[mappedAttribute] = tag[attribute];
      }
    });

    return React.createElement(type, mappedTag);
  });

const getMethodsForTag = (type: string, tags: any, encode = true) => {
  switch (type) {
    case TAG_NAMES.TITLE:
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode),
      };
    case ATTRIBUTE_NAMES.BODY:
    case ATTRIBUTE_NAMES.HTML:
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags),
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode),
      };
  }
};

const getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }: MappedServerState) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);

  // need to have toComponent() and toString()
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent(TAG_NAMES.META, meta.priority),
      ...generateTagsAsReactComponent(TAG_NAMES.LINK, link.priority),
      ...generateTagsAsReactComponent(TAG_NAMES.SCRIPT, script.priority),
    ],
    toString: () =>
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag(TAG_NAMES.META, meta.priority, encode)} ${getMethodsForTag(
        TAG_NAMES.LINK,
        link.priority,
        encode
      )} ${getMethodsForTag(TAG_NAMES.SCRIPT, script.priority, encode)}`,
  };

  return {
    priorityMethods,
    metaTags: meta.default as HTMLMetaElement[],
    linkTags: link.default as HTMLLinkElement[],
    scriptTags: script.default as HTMLScriptElement[],
  };
};

const mapStateOnServer = (props: MappedServerState) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = '',
    titleAttributes,
    prioritizeSeoTags,
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {},
    toString: () => '',
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag(TAG_NAMES.BASE, baseTag, encode),
    bodyAttributes: getMethodsForTag(ATTRIBUTE_NAMES.BODY, bodyAttributes as Attributes, encode),
    htmlAttributes: getMethodsForTag(ATTRIBUTE_NAMES.HTML, htmlAttributes as Attributes, encode),
    link: getMethodsForTag(TAG_NAMES.LINK, linkTags, encode),
    meta: getMethodsForTag(TAG_NAMES.META, metaTags, encode),
    noscript: getMethodsForTag(TAG_NAMES.NOSCRIPT, noscriptTags, encode),
    script: getMethodsForTag(TAG_NAMES.SCRIPT, scriptTags, encode),
    style: getMethodsForTag(TAG_NAMES.STYLE, styleTags, encode),
    title: getMethodsForTag(TAG_NAMES.TITLE, { title, titleAttributes }, encode),
  };
};

export default mapStateOnServer;
