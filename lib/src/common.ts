import { useEffect, useState } from "react";

import type {
  SbGatsbyStory,
  StoryblokBridgeConfigV2
} from '../types'


export const useStoryblokBridge = (
  id: Number,
  cb: (newStory) => void,
  options: StoryblokBridgeConfigV2 = {},
) => {
  const isServer = typeof window === "undefined";
  const isBridgeLoaded =
    !isServer && typeof window.storyblokRegisterEvent !== "undefined";
  const storyId = new URL(window.location?.href).searchParams.get(
    "_storyblok"
  );
  const inStory = +storyId === id;

  if (!isBridgeLoaded || !inStory) {
    return;
  }

  if (!id) {
    console.warn("Story ID is not defined. Please provide a valid ID.");
    return;
  }

  const refreshDevContent = () => {
    return fetch('__refresh', { method: 'post' });
  }

  window.storyblokRegisterEvent(() => {
    const sbBridge = new window.StoryblokBridge(options);
    sbBridge.on(["input", "published", "change"], async (event) => {
      if (event.action === "input" && event.story.id === id) {
        cb(event.story);
      } else if (
        (event.action === "change" || event.action === "published") &&
        (event.storyId as number) === id
      ) {
        // @workaround: give extra time to Gatsby to refresh content before reloading
        await refreshDevContent();
        setTimeout(() => {
          window.location.reload();
        }, 50)
      }
    });
  });
};

export function useStoryblokState(
  originalStory: SbGatsbyStory,
  bridgeOptions: StoryblokBridgeConfigV2 = {}
) {
  if (typeof originalStory.content === 'string')
    originalStory.content = JSON.parse(originalStory.content);

  let [story, setStory] = useState(originalStory);
  useEffect(() => {
    useStoryblokBridge(
      story.internalId,
      (newStory) => setStory(newStory as SbGatsbyStory),
      bridgeOptions
    );
  }, []);

  return story;
}

export { useStoryblokBridge as registerStoryblokBridge };