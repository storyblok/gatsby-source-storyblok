import * as React from "react"
import { graphql } from "gatsby"

import { StoryblokComponent, storyblokEditable, useStoryblokState, StoryblokStory } from "gatsby-source-storyblok"

import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  if (typeof data.storyblokEntry.content === "string") data.storyblokEntry.content = JSON.parse(data.storyblokEntry.content);

  return (
    <Layout>
      <StoryblokStory story={data.storyblokEntry} />
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query HomeQuery {
    storyblokEntry(full_slug: { eq: "gatsby/playground-v5" }) {
      content
      name
      full_slug
      uuid
      id
      internalId
    }
  }
`