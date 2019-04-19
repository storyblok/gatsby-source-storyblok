const StoryblokClient = require('storyblok-js-client')
const Sync = require('./src/sync')
const getStoryParams = require('./src/getStoryParams')
const stringify = require('json-stringify-safe')

exports.sourceNodes = async function({ boundActionCreators }, options) {
  const { createNode, setPluginStatus } = boundActionCreators;
  const client = new StoryblokClient(options, 'https://mapi.storyblok.com/v1');

  Sync.init({
    createNode,
    setPluginStatus,
    client
  })

  const space = await Sync.getSpace()
  const languages = space.language_codes.map((lang) => { return lang + '/*' })
  languages.push('')

  for (var spKey = 0; spKey < languages.length; spKey++) {
    await Sync.getAll('stories', {
      node: 'StoryblokEntry',
      params: getStoryParams(languages[spKey], options),
      process: (item) => {
        item.content = stringify(item.content)
        item.content_type = item.content.component
      }
    })
  }

  await Sync.getAll('tags', {
    node: 'StoryblokTag'
  })

  const datasources = await Sync.getAll('datasources', {
    node: 'StoryblokDatasource'
  })

  for (var dsKey = 0; dsKey < datasources.length; dsKey++) {
    await Sync.getAll('datasource_entries', {
      node: 'StoryblokDatasource',
      params: {datasource: datasources[dsKey].slug},
      process: (item) => {
        item.data_source = datasources[dsKey].slug
      }
    })
  }
}
