require("isomorphic-fetch")
const { storyblokInit, apiPlugin, useStoryblokApi } = require('@storyblok/react');
const Sync = require('./src/sync');
const getStoryParams = require('./src/getStoryParams');
const stringify = require('json-stringify-safe');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = async function ({ actions, reporter }, options) {
  const { createNode, setPluginStatus } = actions;
  const { plugins, ...apiOptions } = options
  storyblokInit({ use: [apiPlugin], apiOptions })

  const client = useStoryblokApi()

  reporter.verbose("Initializing Storyblok source plugin")
  Sync.init({
    createNode,
    setPluginStatus,
    client,
  });

  const languages = [];
  if ("languages" in options) {
    languages.push(...options.languages);
  } else {
    const space = await Sync.getSpace({ typePrefix: apiOptions.typePrefix });
    languages.push(...space.language_codes);
  }

  for (const language of languages) {
    reporter.verbose(`Fetching stories for language "${language}"`);
    try {
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
    }	catch (e) {
      reporter.panic(`Failed to fetch stories for language "${language}"`, e);
    }
  }


  if (options.includeTags !== false) {
    reporter.verbose('Fetching tags');
    try {
      await Sync.getAll('tags', {
        node: 'StoryblokTag',
        params: getStoryParams('', options),
        process: (item) => {
          item.id = item.name;
        },
      });
    } catch (e) {
      reporter.panic('Failed to fetch tags', e);
    }
  }

  if (options.includeLinks === true) {
    reporter.verbose('Fetching links');
    try {
      await Sync.getAll('links', {
        node: 'StoryblokLink',
        params: getStoryParams('', options),
      });
    } catch (e) {
      reporter.panic('Failed to fetch links', e);
    }
  }

  let datasources = [];
  try {
    reporter.verbose('Fetching datasources');
    datasources = await Sync.getAll('datasources', {
      node: 'StoryblokDatasource',
      typePrefix: options.typePrefix,
    });
  } catch (e) {
    reporter.panic('Failed to fetch datasources', e);
  }

  for (const datasource of datasources) {
    // If a datasource filter is set it acts as a whitelist and ignores all datasources not explicitly listed.
    if("datasourceFilter" in options && Array.isArray(options.datasourceFilter) && !options.datasourceFilter.includes(datasource.slug)) {
      reporter.verbose(`Skipping datasource ${datasource.slug} as it is not in the datasource filter`);
      continue;
    }

    reporter.verbose(`Fetching datasource entries for datasource "${datasource.slug}"`);

    const datasourceSlug = datasource.slug;

    try {
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
    } catch (e) {
      reporter.panic(`Failed to fetch datasource entries for datasource "${datasource.slug}"`, e);
    }

    const datasourceDimensions = datasource.dimensions || [];

    for (const dimension of datasourceDimensions) {
      reporter.verbose(`Fetching datasource entries for datasource "${datasource.slug}" and dimension "${dimension.entry_value}"`);
      try {
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
      } catch (e) {
        reporter.panic(`Failed to fetch datasource entries for datasource "${datasource.slug}" and dimension "${dimension.entry_value}"`, e);
      }
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
