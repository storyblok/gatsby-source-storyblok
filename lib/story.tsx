"use client";

import React, { forwardRef } from "react";
import { StoryblokComponent } from "@storyblok/react";
import { useStoryblokState } from "./src/common";
import { ISbGatsbyDataEntry } from "./types";

interface StoryblokStoryProps {
  data: ISbGatsbyDataEntry;
  [key: string]: unknown;
}

const StoryblokStory = forwardRef<HTMLElement, StoryblokStoryProps>(
  ({ data, ...restProps }, ref) => {
    let story = data.storyblokEntry;
    story = useStoryblokState(story);
    return <StoryblokComponent ref={ref} blok={story.content} {...restProps} />;
  }
);

export default StoryblokStory;
