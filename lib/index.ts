import { useEffect, useState } from "react";
import { registerStoryblokBridge } from "@storyblok/react";
export {
  useStoryblokBridge,
  storyblokInit,
  apiPlugin,
  StoryblokComponent,
  storyblokEditable,
  useStoryblokApi,
  getStoryblokApi,
  renderRichText,
  RichTextSchema
} from "@storyblok/react";

import type {
  SbGatsbyStory,
  StoryblokBridgeConfigV2
} from './types'

export function useStoryblokState(originalStory: SbGatsbyStory,
  bridgeOptions: StoryblokBridgeConfigV2 = {}) {
  if (typeof originalStory.content === "string") originalStory.content = JSON.parse(originalStory.content);

  let [story, setStory] = useState(originalStory);
  useEffect(() => {
    registerStoryblokBridge(
      story.internalId,
      (newStory: SbGatsbyStory) => setStory(newStory),
      bridgeOptions
    );
  }, []);

  return story;
}

// Reexport all types so users can have access to them
export * from "./types";