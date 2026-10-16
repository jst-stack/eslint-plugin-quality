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
			ArrowFunctionExpression: node => validateFunction(context, node, names),
			FunctionDeclaration: node => validateFunction(context, node, names),
			FunctionExpression: node => validateFunction(context, node, names),
			TSInterfaceDeclaration: node => validateTypedProps(context, node.id.name, node.body.body, names),
			TSTypeAliasDeclaration(node) {
				if (node.typeAnnotation.type === 'TSTypeLiteral') {
					validateTypedProps(context, node.id.name, node.typeAnnotation.members, names)
				}
			},
		}
	},
}

function validateFunction(context, node, names) {
	if (!isComponent(node)) {
		return
	}
	const props = node.params[0]
	if (props?.type !== 'ObjectPattern') {
		return
	}
	const flags = props.properties
		.map(property => property.type === 'Property' && property.key.type === 'Identifier' ? property.key.name : undefined)
		.filter(name => names.has(name))
	if (flags.length > 1) {
		context.report({ data: { names: flags.join(', ') }, messageId: 'flags', node: props })
	}
}

function isComponent(node) {
	const name = node.id?.type === 'Identifier'
		? node.id.name
		: node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier' ? node.parent.id.name : undefined
	return Boolean(name && /^[A-Z]/u.test(name))
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
