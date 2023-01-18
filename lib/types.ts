import type { ISbStoryData, StoryblokComponentType } from "@storyblok/react";

export interface SbGatsbyStory extends ISbStoryData<StoryblokComponentType<string> & { [index: string]: any; }> {
  internalId: number
}

export type {
  ISbConfig,
  ISbCache,
  ISbResult,
  ISbResponse,
  ISbError,
  ISbNode,
  ISbSchema,
  ThrottleFn,
  AsyncFn,
  ArrayFn,
  ISbContentMangmntAPI,
  ISbManagmentApiResult,
  ISbStories,
  ISbStory,
  ISbDimensions,
  ISbStoryData,
  ISbAlternateObject,
  ISbStoriesParams,
  ISbStoryParams,
  ISbRichtext,
  SbBlokData,
  SbBlokKeyDataTypes,
  SbRichTextOptions,
  SbSDKOptions,
  StoryblokBridgeConfigV2,
  StoryblokBridgeV2,
  StoryblokClient,
  StoryblokComponentType,
} from "@storyblok/react";