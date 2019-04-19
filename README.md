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
* `resolveRelations`: Resolve relationships to other Stories (in the first level of nesting) of a multi-option or single-option field-type. Provide the field key(s) as array to resolve specific fields. Example: ['related_articles', 'author'].

## How to query?

### All Content Entries
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
