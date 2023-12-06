import assert from 'node:assert/strict'
import { convert } from 'unist-util-is'
import { select } from 'hast-util-select'
import mergeNodes from './lib/merge.js'

const isDocumentRootChildren = convert([
	{ type: 'doctype' },
	{ type: 'element', tagName: 'html' },
])

// Document would certainly have a doctype or html element inside of root
const isDocument = node => node.children.some(isDocumentRootChildren)

export const mergeDocuments = (target, source, options) => {
	const mergeHead = options.mergeHead ?? ((target, source) => {
		return mergeNodes(target, source, options, 1) // properties and one level
	})

	const mergeBody = options.mergeBody ?? ((target, source) => {
		mergeNodes(target, source, options, 0) // only properties
		target.children = source.children
		return target
	})

	const targetHtml = select('html', target)
	const sourceHtml = select('html', source)
	mergeNodes(targetHtml, sourceHtml, options, 0) // only properties

	const targetHead = select('head', target)
	const sourceHead = select('head', source)
	assert(targetHead && sourceHead,
		'Document tree cannot miss the head element')
	mergeHead(targetHead, sourceHead)

	const targetBody = select('body', target)
	const sourceBody = select('body', source)
	mergeBody(targetBody, sourceBody)

	return target
}

export const mergeFragments = (target, source, options) =>
	mergeNodes(target, source, options)

export const merge = (target, source, options) => {
	if (isDocument(target)) {
		return mergeDocuments(target, source)
	}

	return mergeFragments(target, source, options)
}

export default merge
