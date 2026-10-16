import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import sonarjs from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'
import { defineQuality } from './qualityPolicy.config.mjs'

const sourceFiles = ['**/*.{js,jsx,mjs,ts,tsx}']
const typeScriptFiles = ['**/*.{ts,tsx}']
const reactFiles = ['**/*.{jsx,tsx}']

export function createRecommendedConfig(plugin, overrides) {
	const policy = defineQuality(overrides)
	return [
		{ ...js.configs.recommended, files: sourceFiles },
		...scope(tseslint.configs.recommended, typeScriptFiles),
		...scope([reactHooks.configs.flat.recommended], reactFiles),
		qualityRules(plugin, policy),
	]
}

export function createRecommendedTypeCheckedConfig(plugin, options = {}) {
	const { policy: overrides, projectService = true, tsconfigRootDir } = options
	const policy = defineQuality(overrides)
	return [
		{ ...js.configs.recommended, files: sourceFiles },
		...scope(tseslint.configs.recommendedTypeChecked, typeScriptFiles, { projectService, tsconfigRootDir }),
		...scope([reactHooks.configs.flat.recommended], reactFiles),
		qualityRules(plugin, policy),
	]
}

function qualityRules(plugin, policy) {
	return {
		files: sourceFiles,
		plugins: { quality: plugin, sonarjs },
		rules: {
			'quality/no-async-component': 'error',
			complexity: ['error', policy.limits.complexity],
			'max-depth': ['error', policy.limits.maxDepth],
			'max-lines': ['error', { max: policy.limits.maxLines, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: policy.limits.maxLinesPerFunction, skipBlankLines: true, skipComments: true }],
			'max-params': ['error', policy.limits.maxParams],
			'quality/no-flag-prop-combinations': ['error', { names: policy.react.booleanVariantNames }],
			'quality/no-heavy-render-work': ['error', { methods: policy.react.calculationMethods }],
			'quality/no-unexplained-disable': ['error', policy.suppressions],
			'sonarjs/cognitive-complexity': ['error', policy.limits.cognitiveComplexity],
			'sonarjs/no-all-duplicated-branches': 'error',
			'sonarjs/no-duplicated-branches': 'error',
			'sonarjs/no-identical-expressions': 'error',
			'sonarjs/no-identical-functions': 'error',
		},
	}
}

function scope(configs, files, parserOptions) {
	return configs.map(config => parserOptions
		? {
			...config,
			files,
			languageOptions: { ...config.languageOptions, parserOptions: { ...config.languageOptions?.parserOptions, ...parserOptions } },
		}
		: { ...config, files })
}
