require("isomorphic-fetch")
const { storyblokInit, apiPlugin, useStoryblokApi } = require("@storyblok/react");
const Sync = require("./src/sync");
const getStoryParams = require("./src/getStoryParams");
const stringify = require("json-stringify-safe");
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = async function ({ actions }, options) {
  const { createNode, setPluginStatus } = actions;
  const { ...apiOptions } = options;

  storyblokInit({ use: [apiPlugin], apiOptions });
  const client = useStoryblokApi();

  Sync.init({
    createNode,
    setPluginStatus,
    client,
  });

  const space = await Sync.getSpace({ typePrefix: apiOptions.typePrefix });

  const languages = options.languages
    ? options.languages
    : space.language_codes;
  languages.push("");

  const fetchStories = async (language) => {
    await Sync.getAll("stories", {
      node: "StoryblokEntry",
      params: getStoryParams(language, options),
      typePrefix: options.typePrefix,
      process: (item) => {
        for (const prop in item.content) {
          if (
            !Object.prototype.hasOwnProperty.call(item.content, prop) ||
            ["_editable", "_uid"].includes(prop)
          ) {
            continue;
          }
          const objectType = Object.prototype.toString
            .call(item.content[prop])
            .replace("[object ", "")
            .replace("]", "")
            .toLowerCase();

          if (!["number", "boolean", "string"].includes(objectType)) {
            continue;
          }

          const type = prop === "component" ? "" : `_${objectType}`;
          item[`field_${prop}${type}`] = item.content[prop];
        }
        item.content = stringify(item.content);
      },
    });
  };

  await Promise.all(languages.map((language) => fetchStories(language)));

  if (options.includeTags !== false) {
    await Sync.getAll("tags", {
      node: "StoryblokTag",
      params: getStoryParams("", options),
      process: (item) => {
        item.id = item.name;
      },
    });
  }

  if (options.includeLinks === true) {
    await Sync.getAll("links", {
      node: "StoryblokLink",
      params: getStoryParams("", options),
    });
  }

  const fetchAllDatasources = async () => {
    return await Sync.getAll("datasources", {
      node: "StoryblokDatasource",
      typePrefix: options.typePrefix,
    });
  };

  const fetchDatasourceEntries = async (datasource) => {
    const datasourceSlug = datasource.slug || datasource;

    const fetchAllEntries = async () => {
      await Sync.getAll("datasource_entries", {
        node: "StoryblokDatasourceEntry",
        typePrefix: options.typePrefix,
        params: { datasource: datasourceSlug },
        process: (item) => {
          item.data_source_dimension = null;
          item.data_source = datasourceSlug;
        },
      });

      const datasourceDimensions = datasource.dimensions || [];
      await Promise.all(
        datasourceDimensions.map((dimension) =>
          Sync.getAll("datasource_entries", {
            node: "StoryblokDatasourceEntry",
            typePrefix: options.typePrefix,
            params: {
              datasource: datasourceSlug,
              dimension: dimension.entry_value,
            },
            process: (item) => {
              item.data_source_dimension = dimension.entry_value;
              item.data_source = datasourceSlug;
            },
          })
        )
      );
    };

    await fetchAllEntries();
  };

  let datasources = [];
  if (options.includeDatasources === undefined) {
    datasources = await fetchAllDatasources();
  } else if (options.includeDatasources.length > 0) {
    datasources = options.includeDatasources;
  }

  await Promise.all(
    datasources.map((datasource) => fetchDatasourceEntries(datasource))
  );
}

exports.onCreateNode = async (
  { node, actions: { createNode }, createNodeId, getCache, cache },
  options
) => {
  if (!options.localAssets) {
    return;
  }
  if (node.internal.type === "StoryblokEntry") {
    // eslint-disable-next-line
    const assetRegex = /(https:\/\/a\.storyblok\.com.+?(?:\.)(\w)*)/g;
    let imagePaths = node.content.match(assetRegex);
    if (imagePaths?.length) {
      imagePaths.forEach(async (imagePath) => {
        let fileNodeID;

        // eslint-disable-next-line
        const mediaDataCacheKey = `sb-${imagePath.replace(/[\/|\\|https:]/g, "")}`;
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
}

