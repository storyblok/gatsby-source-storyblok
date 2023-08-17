"use client";

import React, { forwardRef } from "react";
import { StoryblokComponent } from "@storyblok/react";
import { useStoryblokState } from "./src/common";
import { SbGatsbyStory, StoryblokBridgeConfigV2 } from "./types";

interface StoryblokStoryProps {
  story: SbGatsbyStory;
  bridgeOptions: StoryblokBridgeConfigV2;
  [key: string]: unknown;
}

const StoryblokStory = forwardRef<HTMLElement, StoryblokStoryProps>(
  ({ story, bridgeOptions, ...restProps }, ref) => {
    story = useStoryblokState(story, bridgeOptions);
    return <StoryblokComponent ref={ref} blok={story.content} {...restProps} />;
  }
);

export default StoryblokStory;
