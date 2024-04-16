require("isomorphic-fetch")
const { storyblokInit, apiPlugin, useStoryblokApi } = require('@storyblok/react');
const Sync = require('./src/sync');
const getStoryParams = require('./src/getStoryParams');
const stringify = require('json-stringify-safe');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = async function ({ actions }, options) {
  const { createNode, setPluginStatus } = actions;
  const { plugins, ...apiOptions } = options
  storyblokInit({ use: [apiPlugin], apiOptions })

  const client = useStoryblokApi()

  Sync.init({
    createNode,
    setPluginStatus,
    client,
  });

  const space = await Sync.getSpace({typePrefix: apiOptions.typePrefix});
  const languages = options.languages ? options.languages : space.language_codes;
  languages.push('');

  for (const language of languages) {
    await Sync.getAll('stories', {
      node: 'StoryblokEntry',
      params: getStoryParams(language, options),
      typePrefix: options.typePrefix,
      process: (item) => {
        for (var prop in item.content) {
          // eslint-disable-next-line no-prototype-builtins
          if (!item.content.hasOwnProperty(prop) || ['_editable', '_uid'].indexOf(prop) > -1) {
            continue;
          }
          const objectType = Object.prototype.toString
            .call(item.content[prop])
            .replace('[object ', '')
            .replace(']', '')
            .toLowerCase();

          if (['number', 'boolean', 'string'].indexOf(objectType) === -1) {
            continue;
          }

          const type = prop == 'component' ? '' : '_' + objectType;

          item['field_' + prop + type] = item.content[prop];
        }

        item.content = stringify(item.content);
      },
    });
  }

  await Sync.getAll('tags', {
    node: 'StoryblokTag',
    params: getStoryParams('', options),
    process: (item) => {
      item.id = item.name;
    },
  });

  if (options.includeLinks === true) {
    await Sync.getAll('links', {
      node: 'StoryblokLink',
      params: getStoryParams('', options),
    });
  }

  const datasources = await Sync.getAll('datasources', {
    node: 'StoryblokDatasource',
    typePrefix: options.typePrefix,
  });

  for (const datasource of datasources) {
    // If a datasource filter is set it acts as a whitelist and ignores all datasources not explicitly listed.
    if(options.datasourceFilter && options.datasourceFilter.length > 0 && !options.datasourceFilter.includes(datasource.slug)) {
      continue;
    }

    const datasourceSlug = datasource.slug;

    await Sync.getAll('datasource_entries', {
      node: 'StoryblokDatasourceEntry',
      typePrefix: options.typePrefix,
      params: {
        datasource: datasourceSlug,
      },
      process: (item) => {
        item.data_source_dimension = null;
        item.data_source = datasourceSlug;
      },
    });

    const datasourceDimensions = datasource.dimensions || [];

    for (const dimension of datasourceDimensions) {
      await Sync.getAll('datasource_entries', {
        node: 'StoryblokDatasourceEntry',
        typePrefix: options.typePrefix,
        params: {
          datasource: datasourceSlug,
          dimension: dimension.entry_value,
        },
        process: (item) => {
          item.data_source_dimension = dimension.entry_value;
          item.data_source = datasourceSlug;
        },
      });
    }
  }
};

exports.onCreateNode = async (
  { node, actions: { createNode }, createNodeId, getCache, cache },
  options
) => {
  if (!options.localAssets) {
    return;
  }

  if (node.internal.type === 'StoryblokEntry') {
    const assetRegex = /(https:\/\/a\.storyblok\.com.+?(?:\.)(\w)*)/g;
    let imagePaths = node.content.match(assetRegex);
    if (imagePaths?.length) {
      imagePaths.forEach(async (imagePath) => {
        let fileNodeID;

        const mediaDataCacheKey = `sb-${imagePath.replace(/[\/|\\|https:]/g, '')}`;
        const cacheMediaData = await getCache(mediaDataCacheKey);
        const isCached = cacheMediaData && node.cv === cacheMediaData.updatedAt;

        if (isCached) {
          fileNodeID = cacheMediaData.fileNodeID;
        }

        if (!fileNodeID && imagePath) {
          const fileNode = await createRemoteFileNode({
            url: imagePath,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            getCache,
          });

          if (fileNode.id) {
            fileNodeID = fileNode.id;
            await cache.set(mediaDataCacheKey, {
              fileNodeID,
              updatedAt: node.cv,
            });
          }
        }
      });
    }
  }
};
