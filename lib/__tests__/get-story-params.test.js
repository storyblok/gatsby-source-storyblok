const getStoryParams = require('../src/getStoryParams')

describe('getStoryParams() function', () => {
  test('without any argument should be return a empty object', () => {
    expect(getStoryParams()).toEqual({})
  })

  test('with a language and story as resolveLinks option', () => {
    const options = {
      resolveLinks: 'story'
    }
    expect(getStoryParams('en', options)).toEqual({
      language: 'en',
      resolve_links: 'story'
    })
  })

  test('with a language and url as resolveLinks option', () => {
    const options = {
      resolveLinks: 'url'
    }
    expect(getStoryParams('en', options)).toEqual({
      language: 'en',
      resolve_links: 'url'
    })
  })

  test('with a language and version option', () => {
    const options = {
      version: 'draft'
    }
    expect(getStoryParams('en', options)).toEqual({
      language: 'en',
      version: 'draft'
    })
  })

  test('with a language and version and resolve_relations options', () => {
    const options = {
      version: 'draft',
      resolveRelations: ['page.author', 'page.categories']
    }
    expect(getStoryParams('en', options)).toEqual({
      language: 'en',
      version: 'draft',
      resolve_relations: 'page.author,page.categories'
    })
  })
})
