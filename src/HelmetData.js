import mapStateOnServer from './server';

export default class HelmetData {
  instances = [];

  value = {
    setHelmet: serverState => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: () => this.instances,
      add: instance => {
        this.instances.push(instance);
      },
      remove: instance => {
        const index = this.instances.indexOf(instance);
        this.instances.splice(index, 1);
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
