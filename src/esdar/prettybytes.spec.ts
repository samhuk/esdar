import prettyBytes from './prettyBytes'

describe('prettyBytes', () => {
  describe('prettyBytes', () => {
    const fn = prettyBytes
    test('basic test', () => {
      expect(fn(1024)).toBe('1.024 kB')
    })
  })
})
