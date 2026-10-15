export const noUnexplainedDisable = {
	meta: {
		docs: {
			description: 'Require a concrete reason for every ESLint suppression.',
			recommended: true,
			url: 'https://github.com/jst-stack/eslint-plugin-quality/blob/main/docs/rules/no-unexplained-disable.md',
		},
		messages: { reason: 'Explain this suppression after `--` so reviewers can verify the exception.' },
		schema: [{ additionalProperties: false, properties: { requireReason: { type: 'boolean' } }, type: 'object' }],
		type: 'suggestion',
	},
	create(context) {
		if (context.options[0]?.requireReason === false) {
			return {}
		}
		return {
			Program() {
				for (const comment of context.sourceCode.getAllComments()) {
					const match = comment.value.match(/eslint-disable(?:-next-line|-line)?\b(?<body>.*)/u)
					if (match && !/\s--\s\S/u.test(match.groups?.body ?? '')) {
						context.report({ messageId: 'reason', node: comment })
					}
				}
			},
		}
	},
}
