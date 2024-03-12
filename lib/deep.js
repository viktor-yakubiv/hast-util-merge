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
import { matches } from 'hast-util-select'
import defaultSingletonSelectors from './singleton.js'
import mergeElements from './shallow.js'

/**
 * @param {Element} target
 *   element to be merged to (it is modified)
 * @param {Element} source
 *   element that will be merged into target
 * @param {Options} [options]
 *   configuration of singleton elements, property and data handling
 */
export default function mergeElementsDeep(
	target,
	source,
	options = {},
	level = Infinity
) {
	mergeElements(target, source, { ...options, preserveChildren: true })

	const singletonSelectors = options?.singletonSelectors
		?? defaultSingletonSelectors

	if (level > 0) source.children.forEach((sourceNode) => {
		const singletonSelector = singletonSelectors
			.find(selector => matches(selector, sourceNode))

		// Only looking for a corresponding node
		// if it is required to be no more than one
		const targetNode = singletonSelector != null
			? target.children.find(node => matches(singletonSelector, node))
			: null

		if (targetNode != null) {
			// Elements are shallowly merged if they have a singleton type.
			// Practically, this is a special handling of <title> that is the only
			// singleton having children which should be replaced.
			mergeElements(targetNode, sourceNode, options)
		} else {
			target.children.push(sourceNode)
		}
	})

	return target
}
