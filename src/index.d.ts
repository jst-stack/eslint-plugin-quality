import type { Linter, Rule } from 'eslint'

export type QualityPolicy = {
	limits?: Partial<{
		cognitiveComplexity: number
		complexity: number
		maxDepth: number
		maxExpressionComplexity: number
		maxLineLength: number
		maxLines: number
		maxLinesPerFunction: number
		maxNestedCallbacks: number
		maxParams: number
		maxStatements: number
	}>
	react?: Partial<{
		booleanVariantNames: string[]
		calculationMethods: string[]
	}>
	suppressions?: Partial<{ requireReason: boolean }>
}

export type TypeCheckedOptions = {
	policy?: QualityPolicy
	projectService?: boolean
	tsconfigRootDir?: string
}

declare const plugin: {
	configs: {
		recommended: Linter.Config[]
		recommendedTypeChecked(options?: TypeCheckedOptions): Linter.Config[]
	}
	createConfig(policy?: QualityPolicy): Linter.Config[]
	createRulesConfig(policy?: QualityPolicy): Linter.Config[]
	defaultPolicy: Readonly<Required<QualityPolicy>>
	meta: { name: string, version: string }
	rules: Record<string, Rule.RuleModule>
}

export function defineQuality(policy?: QualityPolicy): Readonly<Required<QualityPolicy>>
export default plugin
