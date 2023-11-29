import type { HTMLAttributes, JSX } from 'react';

import type HelmetData from './HelmetData';

export type Attributes = { [key: string]: string };

interface OtherElementAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

export type HtmlProps = JSX.IntrinsicElements['html'] & OtherElementAttributes;

export type BodyProps = JSX.IntrinsicElements['body'] & OtherElementAttributes;

export type LinkProps = JSX.IntrinsicElements['link'];

export type MetaProps = JSX.IntrinsicElements['meta'] & {
  charset?: string | undefined;
  'http-equiv'?: string | undefined;
  itemprop?: string | undefined;
};

export type TitleProps = HTMLAttributes<HTMLTitleElement>;

export interface HelmetTags {
  baseTag: HTMLBaseElement[];
  linkTags: HTMLLinkElement[];
  metaTags: HTMLMetaElement[];
  noscriptTags: HTMLElement[];
  scriptTags: HTMLScriptElement[];
  styleTags: HTMLStyleElement[];
}

export interface HelmetDatum {
  toString(): string;
  toComponent(): React.Component<any>;
}

export interface HelmetHTMLBodyDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLBodyElement>;
}

export interface HelmetHTMLElementDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLHtmlElement>;
}

export interface HelmetServerState {
  base: HelmetDatum;
  bodyAttributes: HelmetHTMLBodyDatum;
  htmlAttributes: HelmetHTMLElementDatum;
  link: HelmetDatum;
  meta: HelmetDatum;
  noscript: HelmetDatum;
  script: HelmetDatum;
  style: HelmetDatum;
  title: HelmetDatum;
  titleAttributes: HelmetDatum;
  priority: HelmetDatum;
}

export type MappedServerState = HelmetProps & HelmetTags & { encode?: boolean };

export interface TagList {
  [key: string]: HTMLElement[];
}

export interface StateUpdate extends HelmetTags {
  bodyAttributes: BodyProps;
  defer: boolean;
  htmlAttributes: HtmlProps;
  onChangeClientState: (newState: StateUpdate, addedTags: TagList, removedTags: TagList) => void;
  title: string;
  titleAttributes: TitleProps;
}

export interface HelmetProps {
  async?: boolean;
  base?: Attributes; // {"target": "_blank", "href": "http://mysite.com/"}
  bodyAttributes?: BodyProps; // {"className": "root"}
  defaultTitle?: string; // "Default Title"
  defer?: boolean; // Default: true
  encodeSpecialCharacters?: boolean; // Default: true
  helmetData?: HelmetData;
  htmlAttributes?: HtmlProps; // {"lang": "en", "amp": undefined}
  // "(newState) => console.log(newState)"
  onChangeClientState?: (
    newState: StateUpdate,
    addedTags: HelmetTags,
    removedTags: HelmetTags
  ) => void;
  link?: LinkProps[]; // [{"rel": "canonical", "href": "http://mysite.com/example"}]
  meta?: MetaProps[]; // [{"name": "description", "content": "Test description"}]
  noscript?: Attributes[]; // [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
  script?: Attributes[]; // [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
  style?: Attributes[]; // [{"type": "text/css", "cssText": "div { display: block; color: blue; }"}]
  title?: string; // "Title"
  titleAttributes?: Attributes; // {"itemprop": "name"}
  titleTemplate?: string; // "MySite.com - %s"
  prioritizeSeoTags?: boolean; // Default: false
}
