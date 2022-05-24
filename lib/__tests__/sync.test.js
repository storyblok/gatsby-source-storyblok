const StoryblokClient = require('storyblok-js-client')
const Sync = require('../src/sync')

test('horizontal_rule to generate hr tag', () => {
  const createNode = function (node) {
    expect(node.internalId).toBe(123)
    expect(node.id).toBe(`item-123-default`)
  }
  const setPluginStatus = function () { }
  const client = new StoryblokClient({})

  Sync.init({
    createNode,
    setPluginStatus,
    client
  })

  Sync.createNode('Item', { id: 123 })
})