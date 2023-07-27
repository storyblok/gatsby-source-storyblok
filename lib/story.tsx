"use client";

import React, { forwardRef } from "react";
import { StoryblokComponent } from "@storyblok/react";
import { useStoryblokState } from "./src/common";
import { ISbStoryData } from "./types";

interface StoryblokStoryProps {
  story: ISbStoryData;
  [key: string]: unknown;
}

// 🚨 WIP copied from REact SDK story.tsx
const StoryblokStory = forwardRef<HTMLElement, StoryblokStoryProps>(
  ({ story, ...restProps }, ref) => {
    if (typeof story.content === "string") story.content = JSON.parse(story.content);
    story = useStoryblokState(story as any);
    return <StoryblokComponent ref={ref} blok={story.content} {...restProps} />;
  }
);

// 🚨 WIP modifying in Gatsby way
// const StoryblokStory = forwardRef<HTMLElement, StoryblokStoryProps>(
//   ({ data, ...restProps }, ref) => {
//     let story = data.storyblokEntry as any;
//     if (typeof story.content === "string") story.content = JSON.parse(story.content);
//     story = useStoryblokState(story as any);
//     return <StoryblokComponent ref={ref} blok={story.content} {...restProps} />;
//   }
// );

export default StoryblokStory;
