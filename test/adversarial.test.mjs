import assert from 'node:assert/strict'
import test from 'node:test'
import { ESLint } from 'eslint'
import quality from '../src/index.mjs'

const eslint = new ESLint({ overrideConfig: quality.configs.recommended, overrideConfigFile: true })

const repeatedStatements = Array.from({ length: 31 }, (_, index) => `value += ${index}`).join('\n')
const repeatedLines = Array.from({ length: 251 }, (_, index) => `export const value${index} = ${index}`).join('\n')

const regressions = [
	['long lines', `export const describe = () => '${'x'.repeat(150)}'`, '@stylistic/max-len'],
	['multiple statements per line', 'export function update() { let value = 0; value += 1; return value }', '@stylistic/max-statements-per-line'],
	['nested ternaries', "export const label = value => value > 2 ? 'a' : value > 1 ? 'b' : 'c'", 'no-nested-ternary'],
	['statement-heavy functions', `export function calculate() {\nlet value = 0\n${repeatedStatements}\nreturn value\n}`, 'max-statements'],
	['oversized files', repeatedLines, 'max-lines'],
	['wide parameter lists', 'export function save(a, b, c, d, e) {\nreturn [a, b, c, d, e]\n}', 'max-params'],
	['deep control flow', 'export function decide(a, b, c, d) {\nif (a) {\nif (b) {\nif (c) {\nif (d) { return true }\n}\n}\n}\nreturn false\n}', 'max-depth'],
	['callback pyramids', 'export const load = () => first(() => second(() => third(() => fourth(() => true))))', 'max-nested-callbacks'],
	['complex boolean expressions', 'export const allowed = (a, b, c, d, e, f, g) => a && b && c && d && e && f && g', 'sonarjs/expression-complexity'],
	['nested assignments', 'export function readValue() {\nlet value\nreturn value = 1\n}', 'sonarjs/no-nested-assignment'],
	['parameter mutation', 'export function enable(options) {\noptions.enabled = true\nreturn options\n}', 'no-param-reassign'],
	['duplicated branches', "export function status(value) {\nif (value) {\nconst label = 'same'\nconst code = 1\nreturn { label, code }\n} else {\nconst label = 'same'\nconst code = 1\nreturn { label, code }\n}\n}", 'sonarjs/no-all-duplicated-branches'],
	['duplicated functions', 'export function first(value) {\nconst normalized = value.trim()\nconst size = normalized.length\nreturn { normalized, size }\n}\nexport function second(value) {\nconst normalized = value.trim()\nconst size = normalized.length\nreturn { normalized, size }\n}', 'sonarjs/no-identical-functions'],
	['identical expressions', 'export const compare = (left, right) => left === right && left === right', 'sonarjs/no-identical-expressions'],
]

test('recommended preset rejects adversarial readability regressions', async () => {
	for (const [name, code, expectedRule] of regressions) {
		const [result] = await eslint.lintText(code, { filePath: `${name.replaceAll(' ', '-')}.js` })
		assert.ok(result.messages.some(message => message.ruleId === expectedRule), `${name} must trigger ${expectedRule}`)
	}
})

test('recommended preset accepts readable decomposition', async () => {
	const code = `
export function enable(options) {
	return { ...options, enabled: true }
}

export function label(value) {
	if (value > 2) {
		return 'high'
	}
	if (value > 1) {
		return 'medium'
	}
	return 'low'
}
`
	const [result] = await eslint.lintText(code, { filePath: 'readable.js' })
	assert.deepEqual(result.messages, [])
})

test('recommended preset accepts an indivisible long regular expression', async () => {
	const regex = `export const matcher = /${'segment'.repeat(20)}/u`
	const [result] = await eslint.lintText(regex, { filePath: 'matcher.js' })
	assert.equal(result.messages.some(message => message.ruleId === '@stylistic/max-len'), false)
})
