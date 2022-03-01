// import { typeToNodeName } from './utils';
export const createSchemaCustomization = ({ schema, actions: { createTypes } }) => {
  const storyblokTypes = [
    schema.buildObjectType({
      name: 'StoryblokAsset',
      fields: {
        storyId: { type: '[String!]' },
        id: { type: `ID!` },
        localFile: {
          type: `File`,
          extensions: {
            link: {
              from: `fields.localFile`,
            },
          },
        },
      },
      interfaces: ['Node'],
    }),
  ];
  // const storyTypes = options.contentTypes.map((type) => {
  // 	schema.buildObjectType({
  // 		name: typeToNodeName(type),
  // 		fields: {

  // 		},
  // 		interfaces: ['Node'],
  // 	})
  // });
  createTypes(storyblokTypes);
  // createTypes(`
  // 	type MarkdownRemark implements Node {
  // 	frontmatter: Frontmatter
  // 	featuredImg: File @link(from: "fields.localFile")
  // 	}
  // `)
};
