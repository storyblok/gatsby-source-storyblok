const crypto = require('crypto');
const Promise = require('bluebird');
const stringify = require('json-stringify-safe');
const StoryblokClient = require('storyblok-js-client');
const chalk = require('chalk');

exports.sourceNodes = ({ boundActionCreators }, options) => {

  const { createNode, setPluginStatus } = boundActionCreators;

  const client = new StoryblokClient(options);

  const createAndProcessNodes = (resolve, reject) => {
    let allStories = [];
    let lastPage = 1;
    let getStories = page => {
      client.get('cdn/stories', {
        version: options.version,
        per_page: 10,
        page: page
      }).then(res => {
        setPluginStatus({ lastFetched: Date.now() });

        let stories = res.data.stories;
        stories.forEach(story => {
          allStories.push(story);

          story.content = stringify(story.content);

          let node = Object.assign({}, story, {
            id: `storyblok-${story.id}`,
            parent: null,
            children: [],
            internal: {
              mediaType: `application/json`,
              type: 'StoryblokEntry',
              contentDigest: crypto.createHash(`md5`).update(stringify(story)).digest(`hex`)
            }
          });

          createNode(node);

          if (allStories.length == res.total) {
            resolve({ count: allStories.length });
          }
        });

        let total = res.total;
        lastPage = Math.ceil(res.total / res.perPage);

        if (page <= lastPage) {
          page++;
          getStories(page);
        }
      }).catch(error => {
        reject(error);
      });
    };

    getStories(1);
  };

  return new Promise(createAndProcessNodes);
};