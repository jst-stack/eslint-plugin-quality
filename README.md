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
		maxLineLength: 100,
		maxLinesPerFunction: 60,
		maxStatements: 24,
	},
	react: {
		booleanVariantNames: ['primary', 'danger'],
	},
})
```

Unknown policy keys and invalid limits fail while the ESLint config loads.

The default maintainability limits are 120 characters per line, 250 logical lines per file, 80 logical lines and 30 statements per function, 4 parameters, 3 nested blocks or callbacks, cyclomatic complexity 12, cognitive complexity 15, and expression complexity 5. The preset also rejects multiple statements per line, nested ternaries, parameter mutation, nested assignments, and unexplained ESLint suppressions.

If another preset already owns JavaScript, TypeScript, and React correctness rules, compose only JST quality rules:

```js
export default existingConfig(
	...quality.createRulesConfig(),
)
```

## Add architecture rules

Install the independent architecture package when the project also needs enforced layers and module boundaries:

```bash
npm install --save-dev @jst-stack/eslint-plugin-architecture
```

```js
import architecture from '@jst-stack/eslint-plugin-architecture'
import quality from '@jst-stack/eslint-plugin-quality'

export default [
	...quality.configs.recommended,
	...architecture.configs.recommended,
]
```

Choose one quality preset: use `recommended` as a standalone base, `recommendedTypeChecked()` when type-aware rules are worth the extra lint cost, or `createRulesConfig()` when an existing base config already owns TypeScript and React correctness. Do not combine those three quality entry points.

## Scope

Static analysis can catch deterministic code smells and likely bugs. It cannot prove business correctness, choose bounded contexts, judge semantic names, or replace review and behavioral tests.

Use [`@jst-stack/eslint-plugin-architecture`](https://github.com/jst-stack/eslint-plugin-architecture) when you also want enforceable layers, slice isolation, effect boundaries, DI rules, and workspace contracts.
