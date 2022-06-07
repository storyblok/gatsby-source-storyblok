import { useEffect, useState } from "react";
import { useStoryblokBridge as useSbBridge } from "@storyblok/react";
export { useStoryblokBridge, storyblokInit, apiPlugin, StoryblokComponent, storyblokEditable } from "@storyblok/react";

export function useStoryblokState(originalStory, bridgeOptions) {
  if (typeof originalStory.content === "string") originalStory.content = JSON.parse(originalStory.content);

  let [story, setStory] = useState(originalStory);
  useEffect(() => {
    useSbBridge(story.internalId, (newStory) => setStory(newStory), bridgeOptions);
  }, []);

  return story;
}