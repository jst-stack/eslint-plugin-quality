export const noAsyncComponent = {
	meta: {
		docs: {
			description: 'Keep asynchronous orchestration out of React components.',
			recommended: true,
			url: 'https://github.com/jst-stack/eslint-plugin-quality/blob/main/docs/rules/no-async-component.md',
		},
		messages: { async: 'Move asynchronous orchestration out of the component into an action, store, view model, or service.' },
		schema: [],
		type: 'problem',
	},
	create(context) {
		return {
			ArrowFunctionExpression: node => validate(context, node),
			FunctionDeclaration: node => validate(context, node),
			FunctionExpression: node => validate(context, node),
		}
	},
}

function validate(context, node) {
	if (node.async && isComponent(node)) {
		context.report({ messageId: 'async', node })
	}
}

function isComponent(node) {
	const name = node.id?.type === 'Identifier'
		? node.id.name
		: node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier' ? node.parent.id.name : undefined
	return Boolean(name && /^[A-Z]/u.test(name))
}
