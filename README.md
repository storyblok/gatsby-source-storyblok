<div align="center">
	<a href="https://www.storyblok.com?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok" align="center">
		<img src="https://a.storyblok.com/f/88751/1776x360/66e302b912/sb-gatsby-githero.png"  alt="Storyblok Logo">
	</a>
	<h1 align="center">gatsby-source-storyblok</h1>
  <p align="center">
    The Gatsby source plugin you need to interact with <a href="http://www.storyblok.com?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok" target="_blank">Storyblok API</a> and enable the <a href="https://www.storyblok.com/docs/guide/essentials/visual-editor?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok" target="_blank">Real-time Visual Editing Experience</a>.
  </p>
  <br />
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/gatsby-source-storyblok">
    <img src="https://img.shields.io/npm/v/gatsby-source-storyblok/latest.svg?style=flat-square&color=09b3af" alt="gatsby-source-storyblok" />
  </a>
  <a href="https://www.npmjs.com/package/gatsby-source-storyblok" rel="nofollow">
    <img src="https://img.shields.io/npm/dt/gatsby-source-storyblok.svg?style=appveyor&color=09b3af" alt="npm">
  </a>
  <a href="https://discord.gg/jKrbAMz">
   <img src="https://img.shields.io/discord/700316478792138842?label=Join%20Our%20Discord%20Community&style=appveyor&logo=discord&color=09b3af">
   </a>
  <a href="https://twitter.com/intent/follow?screen_name=storyblok">
    <img src="https://img.shields.io/badge/Follow-%40storyblok-09b3af?style=appveyor&logo=twitter" alt="Follow @Storyblok" />
  </a><br/>
  <a href="https://app.storyblok.com/#!/signup?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok">
    <img src="https://img.shields.io/badge/Try%20Storyblok-Free-09b3af?style=appveyor&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHqADAAQAAAABAAAAHgAAAADpiRU/AAACRElEQVRIDWNgGGmAEd3D3Js3LPrP8D8WXZwSPiMjw6qvPoHhyGYwIXNAbGpbCjbzP0MYuj0YFqMroBV/wCxmIeSju64eDNzMBJUxvP/9i2Hnq5cM1devMnz984eQsQwETeRhYWHgIcJiXqC6VHlFBjUeXgav40cIWkz1oLYXFmGwFBImaDFBHyObcOzdW4aSq5eRhRiE2dgYlpuYoYSKJi8vw3GgWnyAJIs/AuPu4scPGObd/fqVQZ+PHy7+6udPOBsXgySLDfn5GRYYmaKYJcXBgWLpsx8/GPa8foWiBhuHJIsl2DkYQqWksZkDFgP5PObcKYYff//iVAOTIDlx/QPqRMb/YSYBaWlOToZIaVkGZmAZSQiQ5OPtwHwacuo4iplMQEu6tXUZMhSUGDiYmBjylFQYvv/7x9B04xqKOnQOyT5GN+Df//8M59ASXKyMHLoyDD5JPtbj42OYrm+EYgg70JfuYuIoYmLs7AwMjIzA+uY/zjAnyWJpDk6GOFnCvrn86SOwmsNtKciVFAc1ileBHFDC67lzG10Yg0+SjzF0ownsf/OaofvOLYaDQJoQIGix94ljv1gIZI8Pv38zPvj2lQWYf3HGKbpDCFp85v07NnRN1OBTPY6JdRSGxcCw2k6sZuLVMZ5AV4s1TozPnGGFKbz+/PE7IJsHmC//MDMyhXBw8e6FyRFLv3Z0/IKuFqvFyIqAzd1PwBzJw8jAGPfVx38JshwlbIygxmYY43/GQmpais0ODDHuzevLMARHBcgIAQAbOJHZW0/EyQAAAABJRU5ErkJggg==" alt="Follow @Storyblok" />
  </a>
</p>

## 🚀 Usage

> If you are first-time user of the Storyblok, read the [Getting Started](https://www.storyblok.com/docs/guide/getting-started?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok) guide to get a project ready in less than 5 minutes.

### Installation

Install `gatsby-source-storyblok`:

```bash
npm install gatsby-source-storyblok
// yarn add gatsby-source-storyblok
```

### Initialization

Register the plugin on your application and add the [access token](https://www.storyblok.com/docs/api/content-delivery#topics/authentication?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok) of your Storyblok space. You can also add the `apiPlugin` in case that you want to use the Storyblok API Client:

> You need to declare the plugin use and its options in `gatsby-config.js`

```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-storyblok',
      options: {
        accessToken: 'YOUR_TOKEN',
        version: 'draft',
        localAssets: true, // Optional parameter to download the images to use with Gatsby Image Plugin
        languages: ['de', 'at'] // Optional parameter. Omission will retrieve all languages by default.
      }
    }
  ]
}
```

`src/components/layout.js`

```JavaScript
import configuration from '../../gatsby-config'

const sbConfig = configuration.plugins.find((item) => item.resolve === 'gatsby-source-storyblok')

storyblokInit({
  accessToken: sbConfig.options.accessToken,
  // bridge: false,
  // apiOptions: {  },
  use: [apiPlugin],
  components: {
    teaser: Teaser,
    grid: Grid,
    feature: Feature
  }
});
```

> Add all your components to the components object in the `storyblokInit` function.

That's it! All the features are enabled for you: the _Api Client_ for interacting with [Storyblok CDN API](https://www.storyblok.com/docs/api/content-delivery#topics/introduction?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok), and _Storyblok Bridge_ for [real-time visual editing experience](https://www.storyblok.com/docs/guide/essentials/visual-editor?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok).

> You can enable/disable some of these features if you don't need them, so you save some KB. Please read the "Features and API" section

### Getting Started

`gatsby-source-storyblok` does three actions when you initialize it:

- Provides a `useStoryblokState` custom hook in your app, that parses story content JSON into the object.
- Loads [Storyblok Bridge](https://www.storyblok.com/docs/Guides/storyblok-latest-js?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok) for real-time visual updates.
- Provides a `storyblokEditable` function to link editable components to the Storyblok Visual Editor.

#### 1. Fetching Content

Query data from GraphQL:

`src/pages/index.js`

```js
import { useStoryblokState } from "gatsby-source-storyblok"

import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  let story = data.storyblokEntry
  story = useStoryblokState(story)

  return (
    <Layout>
      <div>
        <h1>{story.name}</h1>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query HomeQuery {
    storyblokEntry(full_slug: { eq: "home" }) {
      name
      full_slug
    }
  }
`
```

> Note: if you don't use `apiPlugin`, you can use your prefered method or function to fetch your data.

#### 2. Listen to Storyblok Visual Editor events

Use `useStoryblokState` to get the new story every time is triggered a `change` event from the Visual Editor. You need to pass the `originalStory` as a first param. `bridgeOptions` (second param) is an optional param if you want to set the options for bridge by yourself:

```js
import { StoryblokComponent, useStoryblokState } from "gatsby-source-storyblok"

import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  let story = data.storyblokEntry
  story = useStoryblokState(story)

  const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  return (
    <Layout>
      <div>
        <h1>{story.name}</h1>
        {components}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query HomeQuery {
    storyblokEntry(full_slug: { eq: "home" }) {
      content
      name
      full_slug
      internalId
    }
  }
`
```

You can pass Bridge options as a third parameter as well:

```js
useStoryblok(story.internalId, (newStory) => setStory(newStory), {
  resolveRelations: ["Article.author"],
});
```

#### 3. Link your components to Storyblok Visual Editor

For every component you've defined in your Storyblok space, call the `storyblokEditable` function with the blok content:

```js
import { storyblokEditable } from "gatsby-source-storyblok";

const Feature = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} key={blok._uid}>
      <div>{blok.name}</div>
      <p>{blok.description}</p>
    </div>
  );
};

export default Feature;
```

Where `blok` is the actual blok data coming from [Storblok's Content Delivery API](https://www.storyblok.com/docs/api/content-delivery?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok).

As an example, you can check in our [Gatsby.js example demo]() how we use APIs provided from React SDK to combine with Gatsby.js projects.

```js
import { StoryblokComponent, storyblokEditable, useStoryblokState } from "gatsby-source-storyblok"

import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  let story = data.storyblokEntry
  story = useStoryblokState(story)

  const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  return (
    <Layout>
      <div {...storyblokEditable(story.content)}>
        {components}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query HomeQuery {
    storyblokEntry(full_slug: { eq: "home" }) {
      content
      name
      full_slug
      internalId
    }
  }
`
```

### Features and API

You can **choose the features to use** when you initialize the plugin. In that way, you can improve Web Performance by optimizing your page load and save some bytes.

#### Storyblok API

You can use an `apiOptions` object. This is passed down to the [storyblok-js-client config object](https://github.com/storyblok/storyblok-js-client#class-storyblok):

```js
storyblokInit({
  accessToken: "YOUR_ACCESS_TOKEN",
  apiOptions: {
    // storyblok-js-client config object
    cache: { type: "memory" },
  },
  use: [apiPlugin],
  components: {
    teaser: Teaser,
    grid: Grid,
    feature: Feature,
  },
});
```

If you prefer to use your own fetch method, just remove the `apiPlugin` and `storyblok-js-client` won't be added to your application.

```js
storyblokInit({});
```

#### Storyblok Bridge

If you don't use `useStoryblokBridge`, you still have access to the raw `window.StoryblokBridge`:

```js
const sbBridge = new window.StoryblokBridge(options);

sbBridge.on(["input", "published", "change"], (event) => {
  // ...
});
```

### Gatsby feature references

#### With Gatsby's image

You need to set the `localAssets` option to `true`. Here is an example of the usage:

```js
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

function BlogPost({ data }) {
  const image = getImage(data.file)
  return (
    <section>
      <GatsbyImage image={image} />
    </section>
  )
}

export const pageQuery = graphql`
  query {
    file(name: {eq: "demo"}) {
      absolutePath
      url
      childImageSharp {
         gatsbyImageData(
          width: 200
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
  }
`
```

#### With Gatsby's createPages

For more info regarding `createPages` see the Gatsby docs: [docs/reference/config-files/gatsby-node/#createPages](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages)

2a. You need to create a [template](https://www.gatsbyjs.org/docs/programmatically-create-pages-from-data/#specifying-a-template) file to get the data from GraphQL

```js
import { useStoryblokState } from "gatsby-source-storyblok"
import Layout from "../components/layout"

export default function StoryblokEntry ({ data }) {
  const story = data.storyblokEntry
  story = useStoryblokState(story)

  return (
    <Layout>
      <div>{story.name}</div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    storyblokEntry(full_slug: { eq: $full_slug }) {
      internalId
      name
      full_slug
    }
  }
`
```

3a. After this, you need to create the pages for your application. For this, edit your `gatsby-node.js`.

```js
const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const storyblokEntry = path.resolve('src/templates/storyblok-entry.js')

  // querying the storyblok data from GraphQL data layer
  const { data } = await graphql(
    `query {
      allStoryblokEntry {
        edges {
          node {
            internalId
            full_slug
          }
        }
      }
    }`
  )

  // creating pages using createPage function like described in the documentation
  // https://www.gatsbyjs.org/docs/programmatically-create-pages-from-data/#creating-pages
  data.allStoryblokEntry.edges.forEach(edge => {
    const full_slug = edge.node.full_slug

    actions.createPage({
      path: full_slug,
      component: storyblokEntry,
      context: {
        slug: full_slug
      },
    })
  })
}
```


#### With Gatsby's File System Routes API

For more info regarding The File System Routes API see the Gatsby docs: [docs/reference/routing/file-system-route-api/](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/)

2b. Create a collection route inside `src/pages`


```
|-- src
   |-- pages
      |-- {storyblokEntry.full_slug}.js
```


3b. Gatsby will use ths page template for each `storyblokEntry`

```js
import { useStoryblokState } from "gatsby-source-storyblok"
import Layout from "../components/layout"

export default function StoryblokEntry ({ data }) {
  const story = data.storyblokEntry
  story = useStoryblokState(story)

  return (
    <Layout>
      <div>{story.name}</div>
    </Layout>
  )
}

export const query = graphql`
  query ($full_slug: String!) {
    storyblokEntry(full_slug: { eq: $full_slug }) {
      internalId
      name
      full_slug
    }
  }
`
```

#### The options object in details

`gatsby-config.js`

```js
{
  resolve: 'gatsby-source-storyblok',
  options: {
    accessToken: 'YOUR_TOKEN',
    version: 'draft',
    resolveRelations: [''],
    includeLinks: false
  }
}
```

* `accessToken`: Your Storyblok draft token
* `version`: 'draft' or 'published'
* `timeout`: Optionally provide a timeout for the api request
* `resolveLinks`: This will automatically resolve internal links of the multilink field type. If the value is `story` the whole story object will be included.  If the value is `url` only uuid, id, name, path, slug and url (url is a computed property which returns the "Real path" if defined to use it for navigation links) will be included.
* `resolveRelations`: Resolve relationships to other Stories (in the first level of nesting) of a multi-option or single-option field-type. Provide the field key(s) as array to resolve specific fields. Example: ['article.related_articles', 'article.author'].
* `includeLinks`: If 'true' you can query links by allStoryblokLinkEntry. The links query lets you create a dynamic navigation tree as it includes also content folders.
* `languages`: An array of strings that will be used in languages request instead of languages in space settings. Use it to only load the languages that you want to.

#### How to query all Content Entries

To get all entries unfiltered you can do the following query:

```GraphQL
{
  allStoryblokEntry {
    edges {
      node {
        id
        name
        created_at
        published_at
        uuid
        slug
        full_slug
        content
        is_startpage
        parent_id
        group_id
        internalId
      }
    }
  }
}
```

##### How to query filtering of content inside a folder

The following example shows a filter to get all items from a news folder:

```GraphQL
{
  allStoryblokEntry(filter: {full_slug: {regex: "/^news\//"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```

##### How to query filtering of languages

If you use field level translations you can filter for a specific language using following query:

```GraphQL
{
  allStoryblokEntry(filter: {lang: {eq: "de"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```


##### How to query filtering on content type fields

Every field of your content types is available via the prefix ```field_```.

This lets you for example to query for a specific component:

```GraphQL
{
  allStoryblokEntry(filter: {field_component: {eq: "page"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```


#### How to query a single content entry
```GraphQL
{
  storyblokEntry(slug: { eq: "global-navi" }) {
    content
  }
}
```

#### Datasources

```GraphQL
allStoryblokDatasource {
  edges {
    node {
      id
      value
      name
      data_source
    }
  }
}
```

#### How to query Datasource entries

This will return all datasources, with or not dimensions values:

```GraphQL
allStoryblokDatasourceEntry(filter: { data_source: { eq: "DATASOURCE_SLUG" } }) {
  edges {
    node {
      id
      name
      value
      data_source
      data_source_dimension
    }
  }
}
```

If you want to **filter by a specific dimension**, you should use:

```GraphQL
allStoryblokDatasourceEntry(filter: { data_source: { eq: "DATASOURCE_SLUG" }, data_source_dimension: { eq: "DATASOURCE_DIMENSION_VALUE" } }) {
  edges {
    node {
      id
      name
      value
      data_source
      data_source_dimension
    }
  }
}
```

#### How to query links
Use the links api to create a dynamic navigation tree. To use this query you need to add `includeLinks: true` in the plugin options.

```GraphQL
allStoryblokLinkEntry {
  edges {
    node {
      id
      uuid
      slug
      parent_id
      name
      is_folder
      published
      is_startpage
      position
    }
  }
}
```

## 🔗 Related Links

- **[Storyblok Gatsby.js Technology Hub](https://www.storyblok.com/tc/gatsbyjs)**: Learn how to develop your own Gatsby.js applications that use Storyblok APIs to retrieve and manage content.
- **[Getting Started](https://www.storyblok.com/docs/guide/getting-started?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok)**: Get a project ready in less than 5 minutes.
- **[Storyblok CLI](https://github.com/storyblok/storyblok)**: A simple CLI for scaffolding Storyblok projects and fieldtypes.
- **[Storyblok React.js example demo](https://stackblitz.com/edit/react-sdk-demo)**: See and try how React SDK works with React.js projects
- **[Storyblok Gatsby.js example demo](https://codesandbox.io/s/github/storyblok/getting-started/tree/master/gatsbyjs?fontsize=14&hidenavigation=1&theme=dark)**: See and try how gatsby-source-storyblok works with Gatsby.js projects

## ℹ️ More Resources

### Support

- Bugs or Feature Requests? [Submit an issue](/../../issues/new).
- Do you have questions about Storyblok or you need help? [Join our Discord Community](https://discord.gg/jKrbAMz).

### Contributing

Please see our [contributing guidelines](https://github.com/storyblok/.github/blob/main/contributing.md) and our [code of conduct](https://www.storyblok.com/trust-center#code-of-conduct?utm_source=github.com&utm_medium=readme&utm_campaign=gatsby-source-storyblok).
This project use [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for generate new versions by using commit messages and we use the Angular Convention to naming the commits. Check [this question](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-change-the-type-of-commits-that-trigger-a-release) about it in semantic-release FAQ.