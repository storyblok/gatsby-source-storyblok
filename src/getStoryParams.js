/**
 * @method getStoryParams
 * @param  {String}        language 'en', 'de'
 * @param  {Object}        options?  api options
 * @param  {Array<String>} options.resolveRelations? resolve_relations field
 * @param  {String}        options.resolveLinks? can be story or url
 * @param  {String}        options.version? can be draft or released
 */
const getStoryParams = function(language = '', options = {}) {
  let params = {}

  if (options.resolveLinks) {
    params.resolve_links = options.resolveLinks || '1'
  }

  if (options.resolveRelations) {
    params.resolve_relations = options.resolveRelations.join(',')
  }

  if (options.version) {
    params.version = options.version
  }

  if (language.length > 0) {
    params.language = language
  }

  return params
}

module.exports = getStoryParams