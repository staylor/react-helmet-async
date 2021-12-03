import mapStateOnServer from './server';

const instances = [];

export function clearInstances() {
  instances.length = 0;
}

export default class HelmetData {
  value = {
    setHelmet: serverState => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: () => instances,
      add: instance => {
        instances.push(instance);
      },
      remove: instance => {
        const index = instances.indexOf(instance);
        instances.splice(index, 1);
      },
    },
  };

  constructor(context) {
    this.context = context;

    if (!HelmetData.canUseDOM) {
      context.helmet = mapStateOnServer({
        baseTag: [],
        bodyAttributes: {},
        encodeSpecialCharacters: true,
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: '',
        titleAttributes: {},
      });
    }
  }
}
