const crypto = require('crypto');
const stringify = require('json-stringify-safe');

module.exports = {
  init({ createNode, client, setPluginStatus }) {
    setPluginStatus({ lastFetched: Date.now() });
    this.$createNode = createNode;
    this.$client = client;
    this.$cacheVersion = 0;
  },

  async getSpace() {
    const space = await this.getOne('space', 'spaces/me', {
      node: 'StoryblokSpace',
    });
    this.$cacheVersion = space.version;
    return space;
  },

  getPage(type, page, options) {
    let params = {
      per_page: 25,
      page: page,
      cv: this.$cacheVersion,
    };
    params = Object.assign({}, params, options.params);
    return this.$client.get(`cdn/${type}`, params);
  },

  createNode(name, item) {
    const nodeObject = this.builderNode(name, item);

    this.$createNode(nodeObject);
  },

  builderNode(name, item) {
    if (name === 'StoryblokDatasourceEntry') {
      return this.factoryDatasourceEntryNode(name, item);
    }

    return this.factoryDefaultNode(name, item);
  },

  factoryDefaultNode(name, item) {
    const lang = item.lang || 'default';

    return Object.assign({}, item, {
      id: `${name.toLowerCase()}-${item.id}-${lang}`,
      internalId: item.id,
      parent: null,
      children: [],
      internal: {
        type: name,
        contentDigest: crypto.createHash(`md5`).update(stringify(item)).digest(`hex`),
      },
    });
  },

  factoryDatasourceEntryNode(name, item) {
    const dimension = item.data_source_dimension || 'default';
    return Object.assign({}, item, {
      id: `${name.toLowerCase()}-${item.id}-${dimension}`,
      internalId: item.id,
      parent: null,
      children: [],
      internal: {
        type: name,
        contentDigest: crypto.createHash(`md5`).update(stringify(item)).digest(`hex`),
      },
    });
  },

  async getOne(single, type, options) {
    const resp = await this.$client.get(`cdn/${type}`, options.params);
    const item = resp.data[single];
    this.createNode(options.node, item);
    return item;
  },

  async getAll(type, options) {
    let page = 1;
    let res = await this.getPage(type, page, options);
    let all =
      res.data[type].constructor === Object ? Object.values(res.data[type]) : res.data[type];
    let lastPage = Math.ceil(res.total / 25);

    while (page < lastPage) {
      page++;
      res = await this.getPage(type, page, options);
      res.data[type].forEach((item) => {
        all.push(item);
      });
    }

    all.forEach((item) => {
      if (options.process) {
        options.process(item);
      }
      this.createNode(options.node, item);
    });

    return all;
  },
};
