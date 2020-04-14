# Introduction

This is a Gatsby source plugin for building websites using the [Storyblok](https://www.storyblok.com) headless CMS with true visual preview as a data source.

## How to install

`npm install --save gatsby-source-storyblok`

## How to use?

```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-storyblok',
      options: {
        accessToken: 'YOUR_TOKEN',
        homeSlug: 'home',
        version: 'draft'
      }
    }
  ]
}
```

### Plugin options

* `accessToken`: Your Storyblok draft token
* `homeSlug`: The slug of the "home" story. Used to get the content at the root level /
* `version`: 'draft' or 'published'
* `timeout`: Optionally provide a timeout for the api request
* `resolveLinks`: This will automatically resolve internal links of the multilink field type. If the value is `story` the whole story object will be included.  If the value is `url` only uuid, id, name, path, slug and url (url is a computed property which returns the "Real path" if defined to use it for navigation links) will be included. 
* `resolveRelations`: Resolve relationships to other Stories (in the first level of nesting) of a multi-option or single-option field-type. Provide the field key(s) as array to resolve specific fields. Example: ['article.related_articles', 'article.author'].
* `includeLinks`: If 'true' you can query links by allStoryblokLinkEntry. The links query lets you create a dynamic navigation tree as it includes also content folders.

## How to query?

### All Content Entries

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
      }
    }
  }
}
```

#### Filtering of content inside a folder

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

#### Filtering of languages

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


#### Filtering on content type fields

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


### A Single Content Entry
```GraphQL
{
  storyblokEntry(slug: { eq: "global-navi" }) {
    content
  }
}
```

### Datasource Entries
```GraphQL
allStoryblokDataSourceEntry {
  edges {
    node {
      id
      name
      value
      data_source
    }
  }
}
```

### Links
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
