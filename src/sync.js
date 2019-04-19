const crypto = require('crypto')
const stringify = require('json-stringify-safe')

module.exports = {
  init({createNode, client, setPluginStatus}) {
    setPluginStatus({lastFetched: Date.now()})
    this.$createNode = createNode
    this.$client = client
    this.$cacheVersion = 0
  },

  async getSpace() {
    const space = await this.getOne('space', 'spaces/me', {
      node: 'StoryblokSpace'
    })
    this.$cacheVersion = space.version
    return space
  },

  getPage(type, page, options) {
    let params = {
      per_page: 25,
      page: page,
      cv: this.$cacheVersion
    }
    params = Object.assign({}, params, options.params)
    return this.$client.get(`cdn/${type}`, params)
  },

  createNode(name, item) {
    const node = Object.assign({}, item, {
      id: `${name.toLowerCase()}-${item.id}-${item.lang}`,
      parent: null,
      children: [],
      internal: {
        mediaType: `application/json`,
        type: name,
        contentDigest: crypto.createHash(`md5`).update(stringify(item)).digest(`hex`)
      }
    })

    this.$createNode(node)
  },

  async getOne(single, type, options) {
    const resp = await this.$client.get(`cdn/${type}`, options.params)
    const item = resp.data[single]
    this.createNode(options.node, item)
    return item
  },

  async getAll(type, options) {
    let page = 1
    let res = await this.getPage(type, page, options)
    let all = res.data[type]
    let total = res.total
    let lastPage = Math.ceil((res.total / 25))

    while (page < lastPage){
      page++
      res = await this.getPage(type, page, options)
      res.data[type].forEach((item) => {
        all.push(item)
      })
    }

    all.forEach((item) => {
      if (options.process) {
        options.process(item)
      }
      this.createNode(options.node, item)
    })

    return all
  }
}