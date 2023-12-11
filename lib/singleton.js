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
	'meta[charset]',
	'meta[name="description"i]',
	'meta[name="color-scheme"i]',
	'meta[http-equiv="content-language"i]',
	'meta[http-equiv="content-type"i]',
	'meta[http-equiv="default-style"i]',
	'meta[http-equiv="refresh"i]',
	'meta[http-equiv="set-cookie"i]',
	'meta[http-equiv="x-ua-compatible"i]',
	'meta[http-equiv="content-security-policy"i]',
	'track[kind=subtitles][default]',
	'track[kind=captions][default]',
	'track[kind=description][default]',
	'track[kind=chapters][default]',
]
