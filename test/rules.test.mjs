import { RuleTester } from 'eslint'
import test from 'node:test'
import tseslint from 'typescript-eslint'
import { noAsyncComponent } from '../src/rules/noAsyncComponent.rule.mjs'
import { noFlagPropCombinations } from '../src/rules/noFlagPropCombinations.rule.mjs'
import { noHeavyRenderWork } from '../src/rules/noHeavyRenderWork.rule.mjs'
import { noUnexplainedDisable } from '../src/rules/noUnexplainedDisable.rule.mjs'

test('quality rules reject maintainability regressions without JST structure', () => {
	const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', parser: tseslint.parser, sourceType: 'module' } })
	tester.run('no-unexplained-disable', noUnexplainedDisable, {
		invalid: [{ code: '// eslint-disable-next-line no-console\nconsole.log(1)', errors: [{ messageId: 'reason' }] }],
		valid: ['// eslint-disable-next-line no-console -- required CLI output\nconsole.log(1)'],
	})
	tester.run('no-flag-prop-combinations', noFlagPropCombinations, {
		invalid: [
			{ code: 'type ButtonProps = { primary: boolean; danger: boolean }', errors: [{ messageId: 'flags' }], options: [{ names: ['primary', 'danger'] }] },
			{ code: 'function Button({ primary, danger }) { return null }', errors: [{ messageId: 'flags' }], options: [{ names: ['primary', 'danger'] }] },
		],
		valid: ['type ButtonProps = { variant: "primary" | "danger" }'],
	})
	tester.run('no-async-component', noAsyncComponent, {
		invalid: [{ code: 'async function Dashboard() { return null }', errors: [{ messageId: 'async' }] }],
		valid: ['async function loadDashboard() { return null }'],
	})
	tester.run('no-heavy-render-work', noHeavyRenderWork, {
		invalid: [{ code: 'function Dashboard() { return items.reduce((sum, item) => sum + item.value, 0) }', errors: [{ messageId: 'calculation' }], options: [{ methods: ['reduce'] }] }],
		valid: ['function calculateTotal() { return items.reduce((sum, item) => sum + item.value, 0) }'],
	})
})
