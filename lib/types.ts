import type {
  ISbStoryData,
  StoryblokComponentType,
} from "@storyblok/react/rsc";

export interface SbGatsbyStory
  extends ISbStoryData<
    StoryblokComponentType<string> & { [index: string]: any }
  > {
  internalId: number;
}

export interface ISbGatsbyDataEntry {
  storyblokEntry: SbGatsbyStory;
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
} from "@storyblok/react/rsc";
