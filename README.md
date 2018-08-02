# Introduction

This is a Gatsby source plugin for building websites using the [Storyblok](htts://www.storyblok.com) headless CMS with true visual preview as a data source.

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
        version: 'draft',
        timeout: 5000 // only needed if you want to increase the request timeout - default is 5000
      }
    }
  ]
}
```

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
  StoryblokEntry {
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
