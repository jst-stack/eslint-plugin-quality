# @jst-stack/eslint-plugin-quality

Strict, composable TypeScript and React quality rules without a required project architecture.

The preset checks correctness, React and Hooks semantics, unsafe TypeScript patterns, cognitive complexity, maintainability limits, explained suppressions, and component API smells. It does not require JST, FSD, DI, repositories, or specific directories.

## Install

```bash
npm install --save-dev eslint typescript @jst-stack/eslint-plugin-quality
```

## Recommended

```js
import quality from '@jst-stack/eslint-plugin-quality'

export default [
	...quality.configs.recommended,
]
```

## Type-aware

```js
import quality from '@jst-stack/eslint-plugin-quality'

export default [
	...quality.configs.recommendedTypeChecked({
		projectService: true,
		tsconfigRootDir: import.meta.dirname,
	}),
]
```

Type-aware linting is explicit because it starts the TypeScript project service and costs more than syntax-only linting.

## Configure

```js
...quality.createConfig({
	limits: {
		cognitiveComplexity: 12,
		maxLinesPerFunction: 60,
	},
	react: {
		booleanVariantNames: ['primary', 'danger'],
	},
})
```

Unknown policy keys and invalid limits fail while the ESLint config loads.

If another preset already owns JavaScript, TypeScript, and React correctness rules, compose only JST quality rules:

```js
export default existingConfig(
	...quality.createRulesConfig(),
)
```

## Scope

Static analysis can catch deterministic code smells and likely bugs. It cannot prove business correctness, choose bounded contexts, judge semantic names, or replace review and behavioral tests.

Use [`@jst-stack/eslint-plugin-architecture`](https://github.com/jst-stack/eslint-plugin-architecture) when you also want enforceable layers, slice isolation, effect boundaries, DI rules, and workspace contracts.
