import assert from 'node:assert/strict'
import test from 'node:test'
import plugin, { defineQuality } from '../src/index.mjs'

test('recommended preset is standalone and architecture agnostic', () => {
	assert.ok(plugin.configs.recommended.length > 1)
	assert.doesNotThrow(() => defineQuality({ limits: { maxLines: 300 } }))
	assert.throws(() => defineQuality({ layers: {} }), /Unknown quality policy key/u)
})

test('typed preset configures project service explicitly', () => {
	const configs = plugin.configs.recommendedTypeChecked({ projectService: true })
	assert.ok(configs.some(config => config.languageOptions?.parserOptions?.projectService === true))
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
