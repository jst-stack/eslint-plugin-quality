export const noFlagPropCombinations = {
	meta: {
		docs: {
			description: 'Prefer one explicit variant or composition over combinations of boolean variant props.',
			recommended: true,
			url: 'https://github.com/jst-stack/eslint-plugin-quality/blob/main/docs/rules/no-flag-prop-combinations.md',
		},
		messages: { flags: 'Replace boolean variant props ({{names}}) with one explicit variant prop, slots, or composition.' },
		schema: [{ additionalProperties: false, properties: { names: { items: { type: 'string' }, type: 'array' } }, type: 'object' }],
		type: 'suggestion',
	},
	create(context) {
		const names = new Set(context.options[0]?.names ?? [])
		return {
			TSInterfaceDeclaration: node => validateTypedProps(context, node.id.name, node.body.body, names),
			TSTypeAliasDeclaration(node) {
				if (node.typeAnnotation.type === 'TSTypeLiteral') {
					validateTypedProps(context, node.id.name, node.typeAnnotation.members, names)
				}
			},
		}
	},
}

function validateTypedProps(context, typeName, members, names) {
	if (!typeName.endsWith('Props')) {
		return
	}
	const flags = members.filter(member => member.type === 'TSPropertySignature'
		&& member.key.type === 'Identifier'
		&& member.typeAnnotation?.typeAnnotation.type === 'TSBooleanKeyword'
		&& names.has(member.key.name))
	if (flags.length > 1) {
		context.report({ data: { names: flags.map(flag => flag.key.name).join(', ') }, messageId: 'flags', node: flags[0] })
	}
}
