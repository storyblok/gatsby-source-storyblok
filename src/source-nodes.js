import StoryblokClient from 'storyblok-js-client';
import Sync from './sync';
import getStoryParams from './getStoryParams';
import stringify from 'json-stringify-safe';
import { downloadAssetNodes } from './download-assets';
import crypto from 'crypto';
export { createSchemaCustomization } from './create-schema-customizations';
import { typeToNodeName, retrieveAssets, getImageId } from './utils';

export const sourceNodes = async ({ actions, ...gatsbyArguments }, options) => {
  const { createNode } = actions;

  const client = new StoryblokClient(options);

  Sync.init({
    ...actions,
    client,
  });

  const space = await Sync.getSpace();
  const languages = options.languages || space.language_codes;
  const assets = [];
  await Promise.all(
    languages
      .map((language) => {
        return options.contentTypes.map((contentType) => {
          return Sync.getAll('stories', {
            node: typeToNodeName(contentType),
            params: getStoryParams(language, options, contentType),
            process: (item) => {
              for (var prop in item.content) {
                // eslint-disable-next-line no-prototype-builtins
                if (
                  !Object.prototype.hasOwnProperty.call(item.content, prop) ||
                  ['_editable', '_uid'].indexOf(prop) > -1
                ) {
                  continue;
                }
                const objectType = Object.prototype.toString
                  .call(item.content[prop])
                  .replace('[object ', '')
                  .replace(']', '')
                  .toLowerCase();

                if (
                  options.filterProperties &&
                  options.filterProperties[contentType] &&
                  options.filterProperties[contentType].includes(prop)
                ) {
                  item[prop] = item.content[prop];
                  continue;
                }

                if (['number', 'boolean', 'string'].indexOf(objectType) === -1) {
                  continue;
                }

                const type = prop == 'component' ? '' : '_' + objectType;

                item['field_' + prop + type] = item.content[prop];
              }
              assets.push(
                ...retrieveAssets(item.content).map((assetItem) => ({
                  ...assetItem,
                  storyId: item.uuid,
                }))
              );
              item.content = stringify(item.content);
            },
          });
        });
      })
      .flat()
  );

  const assetNodes = await createAssetNodes(combineAssets(assets), createNode);
  await downloadAssetNodes({ actions, ...gatsbyArguments, assetNodes });
};

const combineAssets = (assets) =>
  Object.values(
    assets.reduce((assetMap, asset) => {
      const id = getImageId(asset.src);
      if (!assetMap[id]) {
        assetMap[id] = { id, ...asset, storyId: [asset.storyId] };
      } else if (!assetMap[id].storyId.includes(asset.storyId)) {
        assetMap[id].storyId.push(asset.storyId);
      }
      return assetMap;
    }, {})
  );

const createAssetNodes = async (assets, createNode) =>
  await Promise.all(
    assets.map((assetItem) => {
      const assetNode = {
        ...assetItem,
        internal: {
          type: 'StoryblokAsset',
          contentDigest: crypto.createHash(`md5`).update(stringify(assetItem.src)).digest(`hex`),
        },
      };
      const createdNode = createNode(assetNode);
      return Promise.resolve(createdNode).then(() => assetNode);
    })
  );
