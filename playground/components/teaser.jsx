import React from "react";
import { storyblokEditable } from "gatsby-source-storyblok";

const Teaser = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} key={blok._uid} data-test="teaser">
      <div>
        <h2>{blok.headline}</h2>
      </div>
    </div>
  );
};

export default Teaser;
