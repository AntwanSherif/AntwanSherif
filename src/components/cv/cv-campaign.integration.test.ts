// Integration test for the CV campaign wiring. The full CVDocument can't render in
// vitest's node env (it pulls in motion/react, next/image and client hooks with no
// jsdom), so this drives the REAL CV data through the SAME `resolveCvHref` the
// component uses (imported, not mirrored — no drift). It asserts the load-bearing
// contract: own-property links get utm_campaign, third-party links never do.

import { describe, test, expect } from 'vitest'
import { CV } from '@/data/cv'
import { resolveCvHref } from '@/lib/encoreshot'

const findLink = (label: string) => CV.links.find(l => l.label === label)!
const findProject = (name: string) => CV.projects.find(p => p.name === name)!

describe('CV campaign wiring (surface=web, campaign=acme)', () => {
  const campaign = 'acme'
  const surface = 'web' as const

  test('EncoreShot project link carries utm_campaign=acme', () => {
    const href = resolveCvHref(findProject('EncoreShot').href!, surface, campaign)
    expect(href).toContain('utm_campaign=acme')
    expect(href).toContain('utm_source=cv')
    expect(href).toContain('utm_medium=web')
  })

  test('portfolio self-link carries utm_campaign=acme', () => {
    const href = resolveCvHref(findLink('Portfolio').href, surface, campaign)
    expect(href).toContain('utm_campaign=acme')
    expect(href).toContain('utm_source=cv')
  })

  test('LinkedIn, GitHub and haktiv.com links are NOT tagged', () => {
    const linkedIn = resolveCvHref(findLink('LinkedIn').href, surface, campaign)
    const github = resolveCvHref(findLink('GitHub').href, surface, campaign)
    const haktiv = resolveCvHref(findProject('HAKTIV').href!, surface, campaign)
    expect(linkedIn).not.toContain('utm_campaign')
    expect(github).not.toContain('utm_campaign')
    expect(haktiv).not.toContain('utm_campaign')
    // third-party hrefs pass through untouched
    expect(haktiv).toBe('https://haktiv.com')
  })
})
