# Changelog

## 0.2.1

- Ignore indivisible regular-expression literals in the line-length rule while retaining the limit for ordinary code.

## 0.2.0

- Reject long lines, multiple statements per line, nested ternaries, parameter mutation, nested assignments, callback pyramids, oversized functions, and complex boolean expressions.
- Add stable TypeScript stylistic presets to standalone syntax-only and type-aware configurations.
- Add adversarial and typed-lint regression suites.
- Make the benchmark validate both clean and intentionally invalid corpora instead of measuring ignored files.

## 0.1.2

- Add a rules-only preset for composition with an existing ESLint base config.

## 0.1.1

- Keep dependency resolution compatible with both supported ESLint majors.

## 0.1.0

- Introduce standalone syntax-only and type-aware TypeScript/React quality presets.
- Add configurable cognitive and structural complexity limits.
- Add focused rules for explained suppressions, boolean variant props, and heavy render calculations.
