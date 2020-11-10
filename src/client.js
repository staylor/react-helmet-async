import { HELMET_ATTRIBUTE, TAG_NAMES, TAG_PROPERTIES } from './constants';
import { flattenArray } from './utils';

const updateTags = (document, type, tags) => {
  const headElement = document.head || document.querySelector(TAG_NAMES.HEAD);
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;

  if (tags && tags.length) {
    tags.forEach(tag => {
      const newElement = document.createElement(type);

      // eslint-disable-next-line
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === TAG_PROPERTIES.INNER_HTML) {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === TAG_PROPERTIES.CSS_TEXT) {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const value = typeof tag[attribute] === 'undefined' ? '' : tag[attribute];
            newElement.setAttribute(attribute, value);
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
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }

  oldTags.forEach(tag => tag.parentNode.removeChild(tag));
  newTags.forEach(tag => headElement.appendChild(tag));

  return {
    oldTags,
    newTags,
  };
};

const updateAttributes = (document, tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];

  if (!elementTag) {
    return;
  }

  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(',') : [];
  const attributesToRemove = [].concat(helmetAttributes);
  const attributeKeys = Object.keys(attributes);

  for (let i = 0; i < attributeKeys.length; i += 1) {
    const attribute = attributeKeys[i];
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

const updateTitle = (document, title, attributes) => {
  if (typeof title !== 'undefined' && document.title !== title) {
    document.title = flattenArray(title);
  }

  updateAttributes(document, TAG_NAMES.TITLE, attributes);
};

const commitTagChanges = (document, newState, cb) => {
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
  updateAttributes(document, TAG_NAMES.BODY, bodyAttributes);
  updateAttributes(document, TAG_NAMES.HTML, htmlAttributes);

  updateTitle(document, title, titleAttributes);

  const tagUpdates = {
    baseTag: updateTags(document, TAG_NAMES.BASE, baseTag),
    linkTags: updateTags(document, TAG_NAMES.LINK, linkTags),
    metaTags: updateTags(document, TAG_NAMES.META, metaTags),
    noscriptTags: updateTags(document, TAG_NAMES.NOSCRIPT, noscriptTags),
    scriptTags: updateTags(document, TAG_NAMES.SCRIPT, scriptTags),
    styleTags: updateTags(document, TAG_NAMES.STYLE, styleTags),
  };

  const addedTags = {};
  const removedTags = {};

  Object.keys(tagUpdates).forEach(tagType => {
    const { newTags, oldTags } = tagUpdates[tagType];

    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });

  if (cb) {
    cb();
  }

  onChangeClientState(newState, addedTags, removedTags);
};

// eslint-disable-next-line
let _helmetCallback = null;

const handleStateChangeOnClient = (document, newState) => {
  const window = document.defaultView;
  if (_helmetCallback) {
    window.cancelAnimationFrame(_helmetCallback);
  }

  if (newState.defer) {
    _helmetCallback = window.requestAnimationFrame(() => {
      commitTagChanges(document, newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(document, newState);
    _helmetCallback = null;
  }
};

export default handleStateChangeOnClient;
