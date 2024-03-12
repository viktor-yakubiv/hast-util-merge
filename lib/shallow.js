/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementData} Data
 * @typedef {import('hast').Properties} Properties
 *
 * @typedef Options
 *   Merge function configuration options.
 * @property {(target: Properties, source: Properties) => Properties} [mergeProperties=Object.assign]
 *   custom property merge handler; defaults to `Object.assign`
 * @property {(target: Data?, source: Data?) => Data} [mergeData=Object.assign]
 *   custom data merge handler; defaults to `Object.assign`
 * @property {boolean} [preserveChildren=false] - skips children merging
 * (replacement) if true
 */
import assert from 'node:assert/strict'
import { isElement } from 'hast-util-is-element'

/**
 * Merges elements shallowly, replacing children
 *
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
export default function mergeElements(target, source, options = {}) {
	assert(isElement(target), `Only elements can be merged. Got: ${target}`)
	assert(isElement(source), `Only elements can be merged. Got: ${source}`)
	assert(target.tagName === source.tagName, `Only elements of the same type can be merged properly. Got ${target.tagName}, ${source.tagName}`)

	const mergeProperties = options?.mergeProperties ?? Object.assign
	target.properties = mergeProperties(target.properties, source.properties)

	// Either should exist according to the spec
	if (source.value) target.value == source.value
	if (!options.preserveChildren && source.children) {
		target.children = source.children
	}
	
	// Data is optional
	if (target.data || source.data) {
		const mergeData = options?.mergeData ?? Object.assign
		target.data = mergeData(target.data ?? {}, source.data)
	}

	return target
}
