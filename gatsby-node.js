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
        for (var prop in item.content) {
          if (!item.content.hasOwnProperty(prop) || ['_editable', '_uid'].indexOf(prop) > -1) {
            continue;
          }
          const objectType = Object.prototype.toString.call(item.content[prop])
                                                      .replace('[object ', '')
                                                      .replace(']', '')
                                                      .toLowerCase()

          if (['number', 'boolean', 'string'].indexOf(objectType) === -1) {
            continue;
          }

          const type = prop == 'component' ? '' : ('_' + objectType)

          item['field_' + prop + type] = item.content[prop]
        }
        item.content = stringify(item.content)
      }
    })
  }

  await Sync.getAll('tags', {
    node: 'StoryblokTag'
  })

  if (options.includeLinks === true) {
    await Sync.getAll('links', {
      node: 'StoryblokLink',
      params: getStoryParams('', options)
    })
  }

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
