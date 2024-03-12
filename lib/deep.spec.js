import { h } from 'hastscript'
import mergeNodesDeep from './deep.js'

describe('mergeNodesDeep', () => {
	it('should merge singletons nicely', () => {
		const target = h('head', [
			h('title', 'replaced title'),
			h('link', { href: 'preserved' }),
		])
		const source = h('head', [
			h('title', 'new title'),
			h('link', { href: 'appended' }),
		])
		const expected = h('head', [
			h('title', 'new title'),
			h('link', { href: 'preserved' }),
			h('link', { href: 'appended' }),
		])
		expect(mergeNodesDeep(target, source)).toEqual(expected)
	})
})
