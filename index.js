import assert from 'node:assert/strict'
import { select } from 'hast-util-select'
import {
	extract as extractSlots,
	replace as injectSlots,
} from 'hast-util-slots'
import mergeHead from './lib/head'
import { convert } from 'unist-util-is'

const isDocumentRootChildren = convert([
	{ type: 'doctype' },
	{ type: 'element', tagName: 'html' },
])

// Document would certainly have a doctype or html element inside of root
const isDocument = node => node.children.some(isDocumentRootChildren)

const mergeTrees = (target, ...trees) => trees.reduce((target, source) => {
	if (isDocument(target)) {
		const targetHead = select('head', target)
		const sourceHead = select('head', source)
		assert(targetHead && sourceHead,
			'Document tree cannot miss the head element')
		mergeHead(targetHead, sourceHead)

		const targetBody = select('body', target)
		const sourceBody = select('body', source)
		assert(targetBody && sourceBody,
			'Document tree cannot miss the body element')

		// Since the body element effectively is a fragment,
		// the following recursivelly leads to the 'else' clause below
		mergeTrees(targetBody, sourceBody)
	} else {
		const slots = extractSlots(source)
		injectSlots(target, { values: slots })
	}

	return target
}, target)

export { mergeTrees }
