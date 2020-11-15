const StoryblokClient = require('storyblok-js-client')
const Sync = require('./src/sync')
const getStoryParams = require('./src/getStoryParams')
const stringify = require('json-stringify-safe')

exports.sourceNodes = async function({ boundActionCreators, reporter }, options) {
  const { createNode, setPluginStatus } = boundActionCreators;
  const client = new StoryblokClient(options, 'https://api.storyblok.com/v2');

  Sync.init({
    createNode,
    setPluginStatus,
    client,
    options,
    reporter
  })

  let datasources = []
  const space = await Sync.getSpace()
  const languages = space.language_codes.map((lang) => { return lang + '/*' })
  const include = typeof options.include == 'undefined' ? ['tags', 'datasources', 'datasource_entries'] : options.include
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

  if (include.indexOf('tags') > -1) {
    await Sync.getAll('tags', {
      node: 'StoryblokTag',
      params: getStoryParams('', options),
      process: (item) => {
        item.id = item.name
      }
    })
  }

  if (include.indexOf('links') > -1 || options.includeLinks === true) {
    await Sync.getAll('links', {
      node: 'StoryblokLink',
      params: getStoryParams('', options)
    })
  }

  if (include.indexOf('datasources') > -1) {
    datasources = await Sync.getAll('datasources', {
      node: 'StoryblokDatasource'
    })
  }

  if (include.indexOf('datasource_entries') > -1) {
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
}
