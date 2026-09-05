import { describe, test, expect } from 'vitest'
import { ADMIN_STORAGE_KEY, resolveAdminParam, isAdminVisit } from './analytics-admin'

describe('resolveAdminParam', () => {
  test('admin=1 returns "1"', () => {
    expect(resolveAdminParam('?admin=1')).toBe('1')
  })
  test('admin=0 returns "0"', () => {
    expect(resolveAdminParam('?admin=0')).toBe('0')
  })
  test('missing admin param returns null', () => {
    expect(resolveAdminParam('?co=zauber')).toBe(null)
  })
  test('empty search string returns null', () => {
    expect(resolveAdminParam('')).toBe(null)
  })
  test('any other admin value returns null', () => {
    expect(resolveAdminParam('?admin=true')).toBe(null)
    expect(resolveAdminParam('?admin=yes')).toBe(null)
    expect(resolveAdminParam('?admin=')).toBe(null)
  })
})

describe('isAdminVisit', () => {
  function fakeStorage(value: string | null): Pick<Storage, 'getItem'> {
    return { getItem: () => value }
  }
  test('true when as_admin is "1"', () => {
    expect(isAdminVisit(fakeStorage('1'))).toBe(true)
  })
  test('false when absent', () => {
    expect(isAdminVisit(fakeStorage(null))).toBe(false)
  })
  test('false for any other stored value', () => {
    expect(isAdminVisit(fakeStorage('true'))).toBe(false)
    expect(isAdminVisit(fakeStorage('0'))).toBe(false)
  })
  test('ADMIN_STORAGE_KEY is "as_admin"', () => {
    expect(ADMIN_STORAGE_KEY).toBe('as_admin')
  })
})
