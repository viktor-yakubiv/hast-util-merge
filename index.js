/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementData} Data
 * @typedef {import('hast').Properties} Properties
 *
 * @typedef Options
 *   Merge function configuration options.
 * @property {string[]} [singletonSelectors=defaultSingletonSelectors]
 *   Selectors matching elements that must not occur more than once
 * @property {(target: Properties, source: Properties) => Properties} [mergeProperties=Object.assign]
 *   custom property merge handler; defaults to `Object.assign`
 * @property {(target: Data?, source: Data?) => Data} [mergeData=Object.assign]
 *   custom data merge handler; defaults to `Object.assign`
 * @property {(target: Element?, source: Element?) => Element} mergeHead
 * @property {(target: Element?, source: Element?) => Element} mergeTitle
 * @property {(target: Element?, source: Element?) => Element} mergeBody
 */
import assert from 'node:assert/strict'
import { convert } from 'unist-util-is'
import { select } from 'hast-util-select'
import mergeElements from './lib/shallow.js'
import mergeElementsDeep from './lib/deep.js'
import defaultHeadMerger from './lib/head.js'
import defaultBodyMerger from './lib/body.js'
import defaultTitleMerger from './lib/title.js'

const isDocumentRootChildren = convert([
	{ type: 'doctype' },
	{ type: 'element', tagName: 'html' },
])

// Document would certainly have a doctype or html element inside of root
const isDocument = node => node.children.some(isDocumentRootChildren)

/**
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
export function mergeDocuments(target, source, options = {}) {
	const mergeHead = options?.mergeHead ?? defaultHeadMerger
	const mergeBody = options?.mergeBody ?? defaultBodyMerger
	const mergeTitle = options?.mergeTitle ?? defaultTitleMerger

	const targetHtml = select('html', target)
	const sourceHtml = select('html', source)
	mergeElements(targetHtml, sourceHtml, { ...options, preserveChildren: true })

	const targetHead = select('head', target)
	const sourceHead = select('head', source)
	assert(targetHead && sourceHead,
		'Document tree cannot miss the head element')
	mergeHead(targetHead, sourceHead, { ...options, mergeTitle })

	const targetBody = select('body', target)
	const sourceBody = select('body', source)
	mergeBody(targetBody, sourceBody, options)

	return target
}


/**
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
export function mergeFragments(target, source, options) {
	return mergeElementsDeep(target, source, options)
}


/**
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
export function merge(target, source, options) {
	if (isDocument(target)) {
		return mergeDocuments(target, source)
	}

	return mergeFragments(target, source, options)
}

export default merge
