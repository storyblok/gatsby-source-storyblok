import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

function BlogPost({ data }) {
  const image = getImage(data.file) as any
  return (
    <section>
      <GatsbyImage image={image} alt="test" />
    </section>
  )
}

export default BlogPost

export const pageQuery = graphql`
  query {
    storyblokEntry(full_slug: { eq: "gatsby/" }) {
      content
      name
      full_slug
      uuid
      id
      internalId
    }
    file(name: {eq: "image-1"}) {
      name
      absolutePath
      publicURL
      childImageSharp {
         gatsbyImageData(
          width: 200
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
  }
`