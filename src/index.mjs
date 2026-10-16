import packageMetadata from '../package.json' with { type: 'json' }
import { createRecommendedConfig, createRecommendedTypeCheckedConfig, createRulesConfig } from './configs/recommended.config.mjs'
import { defaultQualityPolicy, defineQuality } from './configs/qualityPolicy.config.mjs'
import { noAsyncComponent } from './rules/noAsyncComponent.rule.mjs'
import { noFlagPropCombinations } from './rules/noFlagPropCombinations.rule.mjs'
import { noHeavyRenderWork } from './rules/noHeavyRenderWork.rule.mjs'
import { noUnexplainedDisable } from './rules/noUnexplainedDisable.rule.mjs'

const plugin = {
	meta: { name: packageMetadata.name, version: packageMetadata.version },
	rules: {
		'no-async-component': noAsyncComponent,
		'no-flag-prop-combinations': noFlagPropCombinations,
		'no-heavy-render-work': noHeavyRenderWork,
		'no-unexplained-disable': noUnexplainedDisable,
	},
}

plugin.configs = {
	recommended: createRecommendedConfig(plugin),
	recommendedTypeChecked: options => createRecommendedTypeCheckedConfig(plugin, options),
}
plugin.createConfig = overrides => createRecommendedConfig(plugin, overrides)
plugin.createRulesConfig = overrides => createRulesConfig(plugin, overrides)
plugin.defaultPolicy = defaultQualityPolicy

export { defineQuality }
export default plugin
