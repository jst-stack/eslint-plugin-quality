import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
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
		...scope(tseslint.configs.stylistic, typeScriptFiles),
		...scope([reactHooks.configs.flat.recommended], reactFiles),
		qualityRules(plugin, policy),
	]
}

export function createRulesConfig(plugin, overrides) {
	return [qualityRules(plugin, defineQuality(overrides))]
}

export function createRecommendedTypeCheckedConfig(plugin, options = {}) {
	const { policy: overrides, projectService = true, tsconfigRootDir } = options
	const policy = defineQuality(overrides)
	return [
		{ ...js.configs.recommended, files: sourceFiles },
		...scope(tseslint.configs.recommendedTypeChecked, typeScriptFiles, { projectService, tsconfigRootDir }),
		...scope(tseslint.configs.stylisticTypeChecked, typeScriptFiles, { projectService, tsconfigRootDir }),
		...scope([reactHooks.configs.flat.recommended], reactFiles),
		qualityRules(plugin, policy),
	]
}

function qualityRules(plugin, policy) {
	return {
		files: sourceFiles,
		plugins: { '@stylistic': stylistic, quality: plugin, sonarjs },
		rules: {
			'@stylistic/max-len': ['error', { code: policy.limits.maxLineLength, ignoreUrls: true, tabWidth: 4 }],
			'@stylistic/max-statements-per-line': ['error', { max: 1 }],
			'quality/no-async-component': 'error',
			curly: ['error', 'all'],
			complexity: ['error', policy.limits.complexity],
			'max-depth': ['error', policy.limits.maxDepth],
			'max-lines': ['error', { max: policy.limits.maxLines, skipBlankLines: true, skipComments: true }],
			'max-lines-per-function': ['error', { max: policy.limits.maxLinesPerFunction, skipBlankLines: true, skipComments: true }],
			'max-nested-callbacks': ['error', policy.limits.maxNestedCallbacks],
			'max-params': ['error', policy.limits.maxParams],
			'max-statements': ['error', policy.limits.maxStatements],
			'no-nested-ternary': 'error',
			'no-param-reassign': ['error', { props: true }],
			'quality/no-flag-prop-combinations': ['error', { names: policy.react.booleanVariantNames }],
			'quality/no-heavy-render-work': ['error', { methods: policy.react.calculationMethods }],
			'quality/no-unexplained-disable': ['error', policy.suppressions],
			'sonarjs/cognitive-complexity': ['error', policy.limits.cognitiveComplexity],
			'sonarjs/expression-complexity': ['error', { max: policy.limits.maxExpressionComplexity }],
			'sonarjs/no-all-duplicated-branches': 'error',
			'sonarjs/no-duplicated-branches': 'error',
			'sonarjs/no-identical-expressions': 'error',
			'sonarjs/no-identical-functions': 'error',
			'sonarjs/no-nested-assignment': 'error',
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
