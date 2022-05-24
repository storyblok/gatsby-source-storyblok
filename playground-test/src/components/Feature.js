import React from "react";
import { storyblokEditable } from "gatsby-source-storyblok";

const Feature = ({ blok }) => {
  return (
    <div className="py-2" {...storyblokEditable(blok)} key={blok._uid} data-test="feature">
      <h2 className="text-lg">{blok.name}</h2>
      <p className="text-lg">{blok.description}</p>
    </div>
  );
};

export default Feature;
