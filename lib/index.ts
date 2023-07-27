export {
  // useStoryblokBridge,
  storyblokInit,
  apiPlugin,
  StoryblokComponent,
  storyblokEditable,
  useStoryblokApi,
  getStoryblokApi,
  renderRichText,
} from "@storyblok/react/rsc";

// Reexport all types so users can have access to them
// Maybe, need to review the types to make sure they are correct
export * from "./types";
export * from "./src/common";

// 1. ✅Copy paste useStoryblokBridge and useStoryblokState from JS SDK & React SDK to Gatsby SDK
// 2. ✅Implement the refreshDevContent function and add it to the useStoryblokBridge (like in the example)
// 3. Copy paste lib/story.jsx from React SDK to Gatsby SDK (possibly, common/client.ts too) -> Maybe, Gatsby SDK doesn’t need to follow this structure if it was for Next.js specific reason?
// 4. ✅ Delete export of StoryblokStory and remove useStoryblokBridge export
// 5. Make the build changes to build StoryblokStory
   // 5.1. Vite config: add extra entry point, terser config + devDependency, banner config
   // 5.2. Update lib/package.json to add new entry point