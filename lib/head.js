import { convertElement } from 'hast-util-is-element'
import mergeElementsDeep from './deep.js'
import defaultTitleMerger from './title.js'

const isTitle = convertElement('title')

export default function mergeHead(target, source, options) {
	const head = mergeElementsDeep(target, source, options, 1) // properties and one level
	const targetTitle = head.children.find(node => isTitle(node))
	const sourceTitle = source.children.find(node => isTitle(node))
	if (sourceTitle && targetTitle) {
		const mergeTitle = options?.mergeTitle ?? defaultTitleMerger
		mergeTitle(targetTitle, sourceTitle, options)
	}
	return head
}
