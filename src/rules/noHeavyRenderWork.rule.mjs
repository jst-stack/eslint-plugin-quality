export const noHeavyRenderWork = {
	meta: {
		docs: {
			description: 'Keep aggregation and in-place sorting out of React render functions.',
			recommended: true,
			url: 'https://github.com/jst-stack/eslint-plugin-quality/blob/main/docs/rules/no-heavy-render-work.md',
		},
		messages: { calculation: 'Move {{method}} out of render into a model, selector, or memoized view model.' },
		schema: [{ additionalProperties: false, properties: { methods: { items: { type: 'string' }, type: 'array' } }, type: 'object' }],
		type: 'suggestion',
	},
	create(context) {
		const methods = new Set(context.options[0]?.methods ?? [])
		return {
			CallExpression(node) {
				const method = node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier'
					? node.callee.property.name
					: undefined
				if (method && methods.has(method) && isInsideComponent(context, node) && isArrayCalculation(context, node.callee.object)) {
					context.report({ data: { method }, messageId: 'calculation', node })
				}
			},
		}
	},
}

function isArrayCalculation(context, node) {
	const services = context.sourceCode.parserServices
	if (!services?.program || !services.esTreeNodeToTSNodeMap) {
		return true
	}
	const checker = services.program.getTypeChecker()
	const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node))
	return checker.isArrayType(type) || checker.isTupleType(type)
}

function isInsideComponent(context, node) {
	const fn = context.sourceCode.getAncestors(node).findLast(isFunction)
	if (!fn) {
		return false
	}
	const name = getFunctionName(fn)
	return Boolean(name && /^[A-Z]/u.test(name))
}

function isFunction(node) {
	return ['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'].includes(node.type)
}

function getFunctionName(node) {
	if (node.id?.type === 'Identifier') {
		return node.id.name
	}
	return node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier' ? node.parent.id.name : undefined
}
