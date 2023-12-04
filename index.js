import { select } from 'hast-util-select'
import { isElement } from 'hast-util-is-element'
import mergeHead from './lib/head'

const mergeTrees = (target, ...trees) => trees.reduce((target, source) => {
	// Document would certainly have a doctype as the first node
	// while fragment would not
	const isFragment = target.children
		.some(node => isElement(node, ['doctype', 'html']))

	if (!isFragment) {
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
