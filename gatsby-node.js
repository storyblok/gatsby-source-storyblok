const StoryblokClient = require('storyblok-js-client')
const Sync = require('./src/sync')
const getStoryParams = require('./src/getStoryParams')
const stringify = require('json-stringify-safe')

exports.sourceNodes = async function({ actions }, options) {
  const { createNode, setPluginStatus } = actions;
  const client = new StoryblokClient(options, 'https://api.storyblok.com/v1');

  Sync.init({
    createNode,
    setPluginStatus,
    client
  })

  const space = await Sync.getSpace()
  const languages = (options.languages ? options.languages : space.language_codes).map((lang) => { return lang + '/*' })
  languages.push('')

  for (const language of languages) {
    await Sync.getAll('stories', {
      node: 'StoryblokEntry',
      params: getStoryParams(language, options),
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
    node: 'StoryblokTag',
    params: getStoryParams('', options),
    process: (item) => {
      item.id = item.name
    }
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

  for (const datasource of datasources) {
    const datasourceSlug = datasource.slug

    await Sync.getAll('datasource_entries', {
      node: 'StoryblokDatasourceEntry',
      params: {
        datasource: datasourceSlug
      },
      process: (item) => {
        item.data_source_dimension = null
        item.data_source = datasourceSlug
      }
    })

    const datasourceDimensions = datasource.dimensions || []

    for (const dimension of datasourceDimensions) {
      await Sync.getAll('datasource_entries', {
        node: 'StoryblokDatasourceEntry',
        params: {
          datasource: datasourceSlug,
          dimension: dimension.entry_value
        },
        process: (item) => {
          item.data_source_dimension = dimension.entry_value
          item.data_source = datasourceSlug
        }
      })
    }
  }
}
