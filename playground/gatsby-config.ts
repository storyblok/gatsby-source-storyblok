import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  flags: {
    PARTIAL_HYDRATION: true
  },
  siteMetadata: {
    title: `test-v5`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-source-storyblok',
      options: {
        accessToken: 'OurklwV5XsDJTIE1NJaD2wtt',
        version: 'draft',
        localAssets: true,
        includeLinks: true,
      }
    },
  ],
}

export default config