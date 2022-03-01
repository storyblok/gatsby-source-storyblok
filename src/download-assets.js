import { createRemoteFileNode } from 'gatsby-source-filesystem';

export const downloadAssetNodes = async ({
  assetNodes,
  actions: { createNode, createNodeField },
  createNodeId,
  cache,
}) =>
  assetNodes.map(async (node) => {
    let fileNodeID;
    const mediaDataCacheKey = `storyblok-asset-${node.id}`;
    const cacheMediaData = await cache.get(mediaDataCacheKey);
    const isCached = cacheMediaData && node.cv === cacheMediaData.updatedAt;

    if (isCached) {
      fileNodeID = cacheMediaData.fileNodeID;
    }

    if (!fileNodeID) {
      const fileNode = await createRemoteFileNode({
        url: node.src,
        parentNodeId: node.id,
        createNode,
        cache,
        createNodeId,
      });

      if (fileNode.id) {
        fileNodeID = fileNode.id;
        await cache.set(mediaDataCacheKey, {
          fileNodeID,
          updatedAt: node.cv,
        });
      }
    }

    if (fileNodeID) {
      createNodeField({ node, name: 'localFile', value: fileNodeID });
    }
  });
