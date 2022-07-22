import type { StoryData, StoryblokComponentType } from "@storyblok/react";

export interface SbGatsbyStory extends StoryData<StoryblokComponentType<string> & { [index: string]: any; }> {
  internalId: number
}

export type {
  AlternateObject,
  Richtext,
  RichtextInstance,
  SbBlokData,
  SbBlokKeyDataTypes,
  SbSDKOptions,
  Stories,
  StoriesParams,
  Story,
  StoryData,
  StoryParams,
  StoryblokBridgeConfigV2,
  StoryblokBridgeV2,
  StoryblokCache,
  StoryblokCacheProvider,
  StoryblokClient,
  StoryblokComponentType,
  StoryblokConfig,
  StoryblokManagmentApiResult,
  StoryblokResult,
  apiPlugin,
  useStoryblokBridge,
  SbReactComponentsMap,
  SbReactSDKOptions
} from "@storyblok/react";