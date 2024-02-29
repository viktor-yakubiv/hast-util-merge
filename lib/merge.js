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
 */
import assert from 'node:assert/strict'
import { isElement } from 'hast-util-is-element'
import { matches } from 'hast-util-select'
import defaultSingletonSelectors from './singleton.js'

/**
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
const mergeNodes = (target, source, options = {}, level = Infinity) => {
	assert(isElement(target), `Only elements can be merged. Got: ${target}`)
	assert(isElement(source), `Only elements can be merged. Got: ${source}`)

	const singletonSelectors = options?.singletonSelectors
		?? defaultSingletonSelectors

	const mergeData = options?.mergeData ?? Object.assign
	const mergeProperties = options?.mergeProperties ?? Object.assign

	target.type = source.type
	target.tagName = source.tagName
	target.value = source.value
	target.data = mergeData(target.data ?? {}, source.data)
	target.properties = mergeProperties(target.properties, source.properties)

	if (level > 0) source.children.forEach((sourceNode) => {
		const singletonSelector = singletonSelectors
			.find(selector => matches(selector, sourceNode))

		// Only looking for a corresponding node
		// if it is required to be no more than one
		const targetNode = singletonSelector != null
			? target.children.find(node => matches(singletonSelector, node))
			: null

		if (targetNode != null) {
			mergeNodes(targetNode, sourceNode, options, level - 1)
		} else {
			target.children.push(sourceNode)
		}
	})

	return target
}

export default mergeNodes
