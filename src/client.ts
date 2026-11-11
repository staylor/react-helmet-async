import { HELMET_ATTRIBUTE, TAG_NAMES, TAG_PROPERTIES } from './constants';
import type { Attributes, StateUpdate, TagList } from './types';
import { flattenArray } from './utils';

interface TagUpdates {
  oldTags: HTMLElement[];
  newTags: HTMLElement[];
}

interface TagUpdateList {
  [key: string]: TagUpdates;
}

const updateTags = (type: string, tags: HTMLElement[]) => {
  const headElement = document.head || document.querySelector(TAG_NAMES.HEAD);
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags: HTMLElement[] = [].slice.call(tagNodes);
  const newTags: HTMLElement[] = [];
  let indexToDelete: number;

  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      const handlers: Record<string, unknown> = {};

      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          const attr = attribute as keyof HTMLElement;
          if (attribute === TAG_PROPERTIES.INNER_HTML) {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === TAG_PROPERTIES.CSS_TEXT) {
            const cssText = (tag as unknown as Record<string, string>).cssText;
            newElement.appendChild(document.createTextNode(cssText));
          } else if (typeof tag[attr] === 'function') {
            // setAttribute() would stringify a function, so onLoad becomes the onload handler.
            handlers[attribute.toLowerCase()] = tag[attr];
          } else {
            const value = typeof tag[attr] === 'undefined' ? '' : tag[attr];
            newElement.setAttribute(attribute, value as string);
          }
        }
      }

      newElement.setAttribute(HELMET_ATTRIBUTE, 'true');

      // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
      if (
        oldTags.some((existingTag, index) => {
          indexToDelete = index;
          return newElement.isEqualNode(existingTag);
        })
      ) {
        // isEqualNode() doesn't compare handlers, so the kept tag takes the current ones.
        Object.assign(oldTags[indexToDelete], handlers);
        oldTags.splice(indexToDelete, 1);
      } else {
        Object.assign(newElement, handlers);
        newTags.push(newElement);
      }
    });
  }

  oldTags.forEach((tag: Node) => tag.parentNode?.removeChild(tag));
  newTags.forEach((tag) => headElement.appendChild(tag));

  return {
    oldTags,
    newTags,
  };
};

const updateAttributes = (tagName: string, attributes: Attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];

  if (!elementTag) {
    return;
  }

  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(',') : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);

  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || '';

    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }

    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }

    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }

  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }

  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(',')) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(','));
  }
};

const updateTitle = (title: string, attributes: Attributes) => {
  if (typeof title !== 'undefined' && document.title !== title) {
    document.title = flattenArray(title);
  }

  updateAttributes(TAG_NAMES.TITLE, attributes);
};

const commitTagChanges = (newState: StateUpdate) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes,
  } = newState;
  updateAttributes(TAG_NAMES.BODY, bodyAttributes as Attributes);
  updateAttributes(TAG_NAMES.HTML, htmlAttributes as Attributes);

  updateTitle(title, titleAttributes as Attributes);

  const tagUpdates: TagUpdateList = {
    baseTag: updateTags(TAG_NAMES.BASE, baseTag),
    linkTags: updateTags(TAG_NAMES.LINK, linkTags),
    metaTags: updateTags(TAG_NAMES.META, metaTags),
    noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, noscriptTags),
    scriptTags: updateTags(TAG_NAMES.SCRIPT, scriptTags),
    styleTags: updateTags(TAG_NAMES.STYLE, styleTags),
  };

  const addedTags: TagList = {};
  const removedTags: TagList = {};

  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];

    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });

  onChangeClientState(newState, addedTags, removedTags);
};

let _pendingState: StateUpdate | null = null;
let _helmetCallback: number | null = null;
let _helmetTimeout: number | null = null;

const cancelPendingCommit = () => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
    _helmetCallback = null;
  }

  if (_helmetTimeout) {
    window.clearTimeout(_helmetTimeout);
    _helmetTimeout = null;
  }

  _pendingState = null;
};

const commitPendingState = () => {
  const newState = _pendingState;
  cancelPendingCommit();

  if (newState) {
    commitTagChanges(newState);
  }
};

const handleStateChangeOnClient = (newState: StateUpdate) => {
  if (newState.defer) {
    // A commit that's already scheduled keeps its deadline and applies the latest state, so a
    // steady stream of updates can't postpone it.
    if (!_pendingState) {
      _helmetCallback = requestAnimationFrame(commitPendingState);
      // Browsers pause animation frames in background tabs, so fall back to a timeout there.
      // 100 ms is long enough for the next frame to win while the tab is visible.
      _helmetTimeout = window.setTimeout(commitPendingState, 100);
    }

    _pendingState = newState;
  } else {
    cancelPendingCommit();
    commitTagChanges(newState);
  }
};

export default handleStateChangeOnClient;
