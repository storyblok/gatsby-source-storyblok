import React from "react";
import { StoryblokComponent, storyblokEditable } from "gatsby-source-storyblok";

const Grid = ({ blok }) => (
  <ul {...storyblokEditable(blok)} key={blok._uid} data-test="grid">
    {blok.columns.map((nestedBlok) => (
      <li key={nestedBlok._uid}>
        <StoryblokComponent blok={nestedBlok} />
      </li>
    ))}
  </ul>
);

export default Grid;
