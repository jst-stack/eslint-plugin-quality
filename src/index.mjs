import packageMetadata from '../package.json' with { type: 'json' }
import { createRecommendedConfig, createRecommendedTypeCheckedConfig } from './configs/recommended.config.mjs'
import { defaultQualityPolicy, defineQuality } from './configs/qualityPolicy.config.mjs'
import { noFlagPropCombinations } from './rules/noFlagPropCombinations.rule.mjs'
import { noHeavyRenderWork } from './rules/noHeavyRenderWork.rule.mjs'
import { noUnexplainedDisable } from './rules/noUnexplainedDisable.rule.mjs'

const plugin = {
	meta: { name: packageMetadata.name, version: packageMetadata.version },
	rules: {
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
plugin.defaultPolicy = defaultQualityPolicy

export { defineQuality }
export default plugin
