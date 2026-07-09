import { describe, test, expect } from 'vitest'
import { slugifyCompany, isOwnPropertyUrl, withCampaign } from './cv-campaign'

describe('slugifyCompany', () => {
  test('lowercases and replaces spaces with hyphens', () => {
    expect(slugifyCompany('Trade Republic')).toBe('trade-republic')
  })
  test('strips punctuation and collapses runs', () => {
    expect(slugifyCompany('Acme, Inc.')).toBe('acme-inc')
  })
  test('empty string returns empty string', () => {
    expect(slugifyCompany('')).toBe('')
  })
  test('all-punctuation returns empty string', () => {
    expect(slugifyCompany('...')).toBe('')
    expect(slugifyCompany('!@#$%')).toBe('')
  })
  test('collapses multiple non-alphanumeric runs into one hyphen', () => {
    expect(slugifyCompany('A  &  B')).toBe('a-b')
  })
  test('trims leading and trailing hyphens', () => {
    expect(slugifyCompany('  Acme  ')).toBe('acme')
    expect(slugifyCompany('-Acme-')).toBe('acme')
  })
  test('already clean slug passthrough', () => {
    expect(slugifyCompany('acme')).toBe('acme')
  })
  test('numbers are preserved', () => {
    expect(slugifyCompany('Studio42')).toBe('studio42')
  })
})

describe('isOwnPropertyUrl', () => {
  test('antwansherif.com apex is own property', () => {
    expect(isOwnPropertyUrl('https://antwansherif.com/')).toBe(true)
  })
  test('antwansherif.com with path is own property', () => {
    expect(isOwnPropertyUrl('https://antwansherif.com/cv')).toBe(true)
  })
  test('encoreshot.com apex is own property', () => {
    expect(isOwnPropertyUrl('https://encoreshot.com/')).toBe(true)
  })
  test('encoreshot.com with params is own property', () => {
    expect(isOwnPropertyUrl('https://encoreshot.com/?utm_source=cv')).toBe(true)
  })
  test('linkedin.com is not own property', () => {
    expect(isOwnPropertyUrl('https://linkedin.com/in/antwan')).toBe(false)
  })
  test('github.com is not own property', () => {
    expect(isOwnPropertyUrl('https://github.com/AntwanSherif')).toBe(false)
  })
  test('haktiv.com is not own property', () => {
    expect(isOwnPropertyUrl('https://haktiv.com/')).toBe(false)
  })
  test('subdomain of antwansherif.com is not own property (apex match only)', () => {
    expect(isOwnPropertyUrl('https://sub.antwansherif.com/')).toBe(false)
  })
  test('attacker domain with antwansherif.com in it is not own property', () => {
    expect(isOwnPropertyUrl('https://evil-antwansherif.com.attacker.com/')).toBe(false)
  })
  test('unparseable URL returns false without throwing', () => {
    expect(isOwnPropertyUrl('not-a-url')).toBe(false)
    expect(isOwnPropertyUrl('')).toBe(false)
    expect(isOwnPropertyUrl(':::invalid')).toBe(false)
  })
})

describe('withCampaign', () => {
  const baseUrl = 'https://antwansherif.com/?utm_source=cv'
  const encoreshotUrl = 'https://encoreshot.com/?utm_source=cv&utm_medium=web'

  test('appends utm_campaign when utm_source=cv present and utm_campaign absent', () => {
    expect(withCampaign(baseUrl, 'acme')).toBe(`${baseUrl}&utm_campaign=acme`)
  })
  test('appends utm_campaign when utm_medium also present', () => {
    expect(withCampaign(encoreshotUrl, 'trade-republic')).toBe(
      `${encoreshotUrl}&utm_campaign=trade-republic`
    )
  })
  test('is idempotent — does not double-append when utm_campaign already present', () => {
    const tagged = `${baseUrl}&utm_campaign=acme`
    expect(withCampaign(tagged, 'acme')).toBe(tagged)
    expect(withCampaign(tagged, 'other')).toBe(tagged)
  })
  test('leaves URL unchanged when utm_source=cv is absent', () => {
    const noSource = 'https://antwansherif.com/'
    expect(withCampaign(noSource, 'acme')).toBe(noSource)
  })
  test('leaves URL unchanged when slug is empty', () => {
    expect(withCampaign(baseUrl, '')).toBe(baseUrl)
  })
  test('third-party URLs without utm_source=cv pass through unchanged', () => {
    const linkedin = 'https://linkedin.com/in/antwan'
    expect(withCampaign(linkedin, 'acme')).toBe(linkedin)
  })
})
