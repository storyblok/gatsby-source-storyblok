"use client";

import React, { forwardRef } from "react";
import { StoryblokComponent } from "@storyblok/react";
import { useStoryblokState } from "./src/common";
import { SbGatsbyStory } from "./types";

interface StoryblokStoryProps {
  story: SbGatsbyStory;
  [key: string]: unknown;
}

const StoryblokStory = forwardRef<HTMLElement, StoryblokStoryProps>(
  ({ story, ...restProps }, ref) => {
    story = useStoryblokState(story);
    return <StoryblokComponent ref={ref} blok={story.content} {...restProps} />;
  }
);

export default StoryblokStory;
