import { describe, test, expect } from 'vitest'
import { encoreshotUrl, stampSurfaceMedium, portfolioUrl } from './encoreshot'

describe('encoreshotUrl', () => {
  test('baseline: source only → utm_source=cv', () => {
    expect(encoreshotUrl({ source: 'cv' })).toBe('https://encoreshot.com/?utm_source=cv')
  })
  test('with medium → utm_source + utm_medium', () => {
    expect(encoreshotUrl({ source: 'cv', medium: 'web' })).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_medium=web'
    )
  })
  test('with campaign → adds utm_campaign', () => {
    expect(encoreshotUrl({ source: 'cv', campaign: 'acme' })).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_campaign=acme'
    )
  })
  test('with medium and campaign → all three params', () => {
    expect(encoreshotUrl({ source: 'cv', medium: 'pdf', campaign: 'trade-republic' })).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_medium=pdf&utm_campaign=trade-republic'
    )
  })
  test('existing callers: source=portfolio, medium=project unchanged', () => {
    expect(encoreshotUrl({ source: 'portfolio', medium: 'project' })).toBe(
      'https://encoreshot.com/?utm_source=portfolio&utm_medium=project'
    )
  })
})

describe('stampSurfaceMedium', () => {
  test('stamps medium onto a source-only URL', () => {
    expect(stampSurfaceMedium('https://encoreshot.com/?utm_source=cv', 'web')).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_medium=web'
    )
  })
  test('passes through a URL that already has utm_medium', () => {
    const url = 'https://encoreshot.com/?utm_source=cv&utm_medium=web'
    expect(stampSurfaceMedium(url, 'pdf')).toBe(url)
  })
  test('passes through a URL that has no utm_source', () => {
    const url = 'https://example.com/'
    expect(stampSurfaceMedium(url, 'web')).toBe(url)
  })
})

describe('portfolioUrl', () => {
  test('bare call → utm_source=cv only', () => {
    expect(portfolioUrl({})).toBe('https://antwansherif.com/?utm_source=cv')
  })
  test('with medium → utm_source + utm_medium', () => {
    expect(portfolioUrl({ medium: 'web' })).toBe(
      'https://antwansherif.com/?utm_source=cv&utm_medium=web'
    )
  })
  test('with campaign → utm_source + utm_campaign', () => {
    expect(portfolioUrl({ campaign: 'acme' })).toBe(
      'https://antwansherif.com/?utm_source=cv&utm_campaign=acme'
    )
  })
  test('with medium and campaign → all three params', () => {
    expect(portfolioUrl({ medium: 'pdf', campaign: 'trade-republic' })).toBe(
      'https://antwansherif.com/?utm_source=cv&utm_medium=pdf&utm_campaign=trade-republic'
    )
  })
})
