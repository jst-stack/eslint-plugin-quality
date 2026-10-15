const defaults = Object.freeze({
	limits: Object.freeze({
		cognitiveComplexity: 15,
		complexity: 12,
		maxDepth: 3,
		maxLines: 250,
		maxLinesPerFunction: 80,
		maxParams: 4,
	}),
	react: Object.freeze({
		booleanVariantNames: Object.freeze([
			'compact', 'danger', 'dense', 'error', 'ghost', 'large', 'loading', 'outline', 'primary', 'secondary', 'small', 'success',
		]),
		calculationMethods: Object.freeze(['reduce', 'sort', 'sortBy', 'toSorted']),
	}),
	suppressions: Object.freeze({ requireReason: true }),
})

export const defaultQualityPolicy = defaults

export function defineQuality(overrides = {}) {
	assertObject(overrides, 'quality policy')
	assertKnownKeys(overrides, defaults)
	const policy = {
		limits: { ...defaults.limits, ...overrides.limits },
		react: { ...defaults.react, ...overrides.react },
		suppressions: { ...defaults.suppressions, ...overrides.suppressions },
	}
	validate(policy)
	return deepFreeze(policy)
}

function assertKnownKeys(value, shape, parent = '') {
	for (const [key, entry] of Object.entries(value)) {
		const keyPath = parent ? `${parent}.${key}` : key
		if (!(key in shape)) {
			throw new TypeError(`Unknown quality policy key: ${keyPath}`)
		}
		if (isObject(entry) && isObject(shape[key])) {
			assertKnownKeys(entry, shape[key], keyPath)
		}
	}
}

function validate(policy) {
	for (const [name, value] of Object.entries(policy.limits)) {
		if (!Number.isInteger(value) || value < 1) {
			throw new TypeError(`limits.${name} must be a positive integer.`)
		}
	}
	for (const name of ['booleanVariantNames', 'calculationMethods']) {
		if (!Array.isArray(policy.react[name]) || policy.react[name].some(value => typeof value !== 'string')) {
			throw new TypeError(`react.${name} must be an array of strings.`)
		}
	}
	if (typeof policy.suppressions.requireReason !== 'boolean') {
		throw new TypeError('suppressions.requireReason must be boolean.')
	}
}

function deepFreeze(value) {
	for (const entry of Object.values(value)) {
		if (entry && typeof entry === 'object') {
			deepFreeze(entry)
		}
	}
	return Object.freeze(value)
}

function assertObject(value, label) {
	if (!isObject(value)) {
		throw new TypeError(`${label} must be an object.`)
	}
}

function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
}
