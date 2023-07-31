import React from "react";
import { storyblokEditable, StoryblokComponent } from "gatsby-source-storyblok";

const Page = ({ blok }) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
};

export default Page;
