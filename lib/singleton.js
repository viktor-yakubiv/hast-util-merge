import { matches } from 'hast-util-select'

export const singletonElements = [
	'title',
]

const matchSingleton = node => singletonElements
	.find(selector => matches(node, selector))

export default matchSingleton
