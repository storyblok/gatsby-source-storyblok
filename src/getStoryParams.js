module.exports = function(language, options) {
  let params = {}

  if (options.resolveLinks) {
    params.resolve_links = '1'
  }

  if (options.resolveRelations) {
    params.resolve_relations = options.resolveRelations.join(',')
  }

  if (options.version) {
    params.version = options.version
  }

  if (language.length > 0) {
    params.starts_with = language
  }

  return params
}