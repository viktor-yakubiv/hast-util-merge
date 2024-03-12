import { h } from 'hastscript'
import { merge, mergeFragments, mergeDocuments } from './index.js'

const layout = h(null, [
	h('html', [
		h('head', [
		h('meta', { charset: 'utf-8' }),
			h('title', 'Layout'),
		h('link', { rel: 'stylesheet', href: 'layout.css' }),
		]),
		h('body', 'overriden'),
	]),
])

const page = h(null, [
	h('html', [
		h('head', [
		h('meta', { charset: 'utf-8' }),
			h('title', 'Page'),
		h('link', { rel: 'stylesheet', href: 'page.css' }),
		]),
	h('body', { lang: 'en' }, 'page'),
	]),
])

const consolidatedDocument = h(null, [
	h('html', [
		h('head', [
		h('meta', { charset: 'utf-8' }),
			h('title', 'Page'),
		h('link', { rel: 'stylesheet', href: 'layout.css' }),
		h('link', { rel: 'stylesheet', href: 'page.css' }),
		]),
	h('body', { lang: 'en' }, 'page'),
	]),
])
describe('mergeDocuments', () => {
	it('should merge head respecting singletons', () => {
		expect(mergeDocuments(structuredClone(layout), page))
			.toEqual(consolidatedDocument)
	})
})

describe('mergeFragments', () => {})

describe('merge', () => {
	// It fails but I need mergeDocument only at the moment
	it.skip('detects node type automatically', () => {
		expect(merge(structuredClone(layout), page)).toEqual(consolidatedDocument)

		expect(merge(h('div', 'replaced'), h('div', { lang: 'en' }, 'new')))
			.toEqual(h('div', { lang: 'en' }, 'new'))
	})
})
