import * as React from "react";
import { graphql } from "gatsby";

//6.1.0 --> feat: now you can refresh & Won't break StoryblokStory approach
import { StoryblokStory } from "gatsby-source-storyblok";

import Layout from "../components/layout";

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>{data.storyblokEntry.name}</h1>
      <StoryblokStory story={data.storyblokEntry} />
    </Layout>
  );

  // 🚨 Gatsby V4 support code, old approach -> Move later as a new page in page directory
  // let story = data.storyblokEntry
  // story = useStoryblokState(story)

  // const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  // return (
  //   <Layout>
  //     {components}
  //   </Layout>
  // )
};

export default IndexPage;

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
`;
