"use server"// TRY OUT THIS LINE TO SEE IF IT FAILS
import React, { useEffect } from "react";
import { storyblokEditable } from "gatsby-source-storyblok";

const Feature = ({ blok }) => {
  useEffect(() => {
    console.log("Feature component mounted"); // THIS SHOULD FAIL OR BE IGNORED
  });
  return (
    <div className="py-2" {...storyblokEditable(blok)} key={blok._uid} data-test="feature">
      <h2 className="text-lg">{blok.name}</h2>
      <p className="text-lg">{blok.description}</p>
    </div>
  );
};

export default Feature;
