import assert from 'node:assert/strict'
import { ESLint } from 'eslint'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import plugin, { defineQuality } from '../src/index.mjs'

const fixtureRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/typed')

test('recommended preset is standalone and architecture agnostic', () => {
	assert.ok(plugin.configs.recommended.length > 1)
	assert.doesNotThrow(() => defineQuality({ limits: { maxLines: 300 } }))
	assert.throws(() => defineQuality({ layers: {} }), /Unknown quality policy key/u)
})

test('typed preset configures project service explicitly', () => {
	const configs = plugin.configs.recommendedTypeChecked({ projectService: true })
	assert.ok(configs.some(config => config.languageOptions?.parserOptions?.projectService === true))
})

test('typed preset rejects unsafe asynchronous code', async () => {
	const eslint = new ESLint({
		cwd: fixtureRoot,
		overrideConfig: plugin.configs.recommendedTypeChecked({ tsconfigRootDir: fixtureRoot }),
		overrideConfigFile: true,
	})
	const [result] = await eslint.lintFiles(['unsafe.ts'])
	assert.ok(result.messages.some(message => message.ruleId === '@typescript-eslint/no-floating-promises'))
})

test('recommended preset does not emit undefined flat-config properties', () => {
	for (const config of plugin.configs.recommended) {
		assert.equal(Object.values(config).includes(undefined), false)
	}
})

test('rules-only preset composes without registering a TypeScript parser plugin', () => {
	const configs = plugin.createRulesConfig()
	assert.equal(configs.length, 1)
	assert.equal(configs[0].plugins?.ts, undefined)
	assert.equal(configs[0].rules?.['quality/no-heavy-render-work'][0], 'error')
})
