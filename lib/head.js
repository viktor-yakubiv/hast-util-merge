import assert from 'node:assert/strict'
import merge from 'lodash.merge'
import { isElement } from 'hast-util-is-element'
import { select } from 'hast-util-select'
import matchSingleton from './singleton.js'

const mergeNode = (tree, selector, node) => {
	const target = select(selector, tree)
	if (target != null) merge(target, node)
	else tree.children.push(node)
}

const mergeHead = (target, source) => {
	assert(isElement(target, 'head'), "Target node is expected to be 'head'")
	assert(isElement(source, 'head'), "Source node is expected to be 'head'")

	let prevElementSingleton = false
	source.children.forEach((node) => {
		const singletonSelector = matchSingleton(node)
		const isSingleton = !!singletonSelector

		if (isSingleton) {
			mergeNode(target, singletonSelector, node)
			prevElementSingleton = true
		} else if (!isElement(node) && prevElementSingleton) {
			// Skipping text nodes in between and after singleton nodes.
			// Typically, this is whitespace.
		} else {
			appendNode(target, node)
		}
	})
}

export default mergeHead
