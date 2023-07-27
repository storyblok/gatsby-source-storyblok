import * as React from "react"
import { graphql } from "gatsby"

//6.1.0 --> feat: now you can refresh & Won't break StoryblokStory approach
import StoryblokStory from "gatsby-source-storyblok/story"

import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  // 🚨 Gatsby V5 support original playground code
  if (typeof data.storyblokEntry.content === "string") data.storyblokEntry.content = JSON.parse(data.storyblokEntry.content);

  console.log(<StoryblokStory story={data.storyblokEntry.content} blok={data.storyblokEntry.content} />)

  return (
    <Layout>
      <h1>{data.storyblokEntry.name}</h1>
      <StoryblokStory story={data.storyblokEntry.content} blok={data.storyblokEntry.content} />
    </Layout>
  )

  // 🚨 Gatsby V4 support code, old approach -> Move later as a new page in page directory
  // let story = data.storyblokEntry
  // story = useStoryblokState(story)

  // const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  // return (
  //   <Layout>
  //     {components}
  //   </Layout>
  // )
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