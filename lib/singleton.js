/**
 * List of selectors identifying elements that should not occur in the document
 * more than once.
 *
 * The list does not describe the surrounding context,
 * e.g. the `<track>` element can occur only inside of `<video>` or `<audio>`
 * element but this is not written due to matching limiation
 * of hast-util-select's `match` function.
 *
 * The list does not pretend to be extensive
 * but this is as many as I could pull from the WHATWG Living Standard
 *
 * @type {string[]}
 */
export default [
	'html',
	'head',
	'body',
	'title',
	'base',
	'track[kind=subtitles][default]',
	'track[kind=captions][default]',
	'track[kind=description][default]',
	'track[kind=chapters][default]',
]
