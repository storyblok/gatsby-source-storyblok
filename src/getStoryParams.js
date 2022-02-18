/**
 * @method getStoryParams
 * @param  {String}        language 'en', 'de'
 * @param  {Object}        options?  api options
 * @param  {Array<String>} options.resolveRelations? resolve_relations field
 * @param  {String}        options.resolveLinks? can be story or url
 * @param  {String}        options.version? can be draft or released
 */
const getStoryParams = function (language, options = {}, contentType = '') {
  let params = {};

  if (contentType !== '') {
    params.filter_query = { component: { in: contentType } };
  }

  if (options.resolveLinks) {
    params.resolve_links = options.resolveLinks || '1';
  }

  if (options.resolveRelations && options.resolveRelations[contentType]) {
    params.resolve_relations = options.resolveRelations[contentType]
      .map((relation) => `${contentType}.${relation}`)
      .join(',');
  }
  console.log(params);

  if (options.version) {
    params.version = options.version;
  }

  if (language.length > 0) {
    params.language = language;
  }

  return params;
};

module.exports = getStoryParams;
