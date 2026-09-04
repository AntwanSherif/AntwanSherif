import { describe, test, expect } from 'vitest'
import { readCampaignFromLocation, stampSiteCampaign } from './site-campaign'

describe('readCampaignFromLocation', () => {
  test('reads and slugifies the co param', () => {
    expect(readCampaignFromLocation('?co=Zauber')).toBe('zauber')
  })
  test('slugifies multi-word company names', () => {
    expect(readCampaignFromLocation('?co=Trade%20Republic')).toBe('trade-republic')
  })
  test('missing co param returns null', () => {
    expect(readCampaignFromLocation('?utm_source=github')).toBe(null)
  })
  test('empty search string returns null', () => {
    expect(readCampaignFromLocation('')).toBe(null)
  })
  test('empty co value returns null', () => {
    expect(readCampaignFromLocation('?co=')).toBe(null)
  })
  test('all-punctuation co value returns null', () => {
    expect(readCampaignFromLocation('?co=...')).toBe(null)
  })
  test('co alongside other params', () => {
    expect(readCampaignFromLocation('?utm_source=linkedin&co=Acme&foo=bar')).toBe('acme')
  })
})

describe('stampSiteCampaign', () => {
  test('own-property URL with no utm_source stamps source=portfolio and campaign', () => {
    expect(stampSiteCampaign('https://encoreshot.com/', 'zauber')).toBe(
      'https://encoreshot.com/?utm_source=portfolio&utm_campaign=zauber'
    )
  })
  test('antwansherif.com self-link with no utm_source stamps both', () => {
    expect(stampSiteCampaign('https://antwansherif.com/projects', 'zauber')).toBe(
      'https://antwansherif.com/projects?utm_source=portfolio&utm_campaign=zauber'
    )
  })
  test('own-property URL that already has utm_source keeps it, adds campaign', () => {
    expect(stampSiteCampaign('https://encoreshot.com/?utm_source=cv', 'zauber')).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_campaign=zauber'
    )
  })
  test('own-property URL that already has utm_campaign is a no-op', () => {
    const tagged = 'https://encoreshot.com/?utm_source=portfolio&utm_campaign=acme'
    expect(stampSiteCampaign(tagged, 'zauber')).toBe(tagged)
  })
  test('third-party URL is a no-op regardless of campaign', () => {
    const linkedin = 'https://linkedin.com/in/antwan'
    expect(stampSiteCampaign(linkedin, 'zauber')).toBe(linkedin)
  })
  test('empty slug is a no-op', () => {
    expect(stampSiteCampaign('https://encoreshot.com/', '')).toBe('https://encoreshot.com/')
  })
  test('unparseable URL is a no-op without throwing', () => {
    expect(stampSiteCampaign('not-a-url', 'zauber')).toBe('not-a-url')
  })
})
