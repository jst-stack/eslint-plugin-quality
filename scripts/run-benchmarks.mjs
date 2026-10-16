import { ESLint } from 'eslint'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import quality from '../src/index.mjs'

const cleanFiles = Array.from({ length: 250 }, (_, index) => ({
	code: `export function value${index}(input) {\n\treturn input?.value ?? ${index}\n}`,
	filePath: `fixture/value${index}.js`,
}))
const adversarialFiles = Array.from({ length: 250 }, (_, index) => ({
	code: `export function mutate${index}(options) { options.enabled = true; return options }`,
	filePath: `fixture/mutate${index}.js`,
}))
const startMemory = process.memoryUsage().heapUsed
const startCpu = process.cpuUsage()
const start = performance.now()
const eslint = new ESLint({ overrideConfig: quality.configs.recommended, overrideConfigFile: true })

const clean = await lint(cleanFiles)
const adversarial = await lint(adversarialFiles)

if (clean.diagnostics !== 0 || adversarial.diagnostics < adversarialFiles.length) {
	throw new Error(`Invalid benchmark corpus: clean=${clean.diagnostics}, adversarial=${adversarial.diagnostics}.`)
}

const cpu = process.cpuUsage(startCpu)
process.stdout.write(`${JSON.stringify({
	cpuMs: (cpu.user + cpu.system) / 1_000,
	files: cleanFiles.length + adversarialFiles.length,
	heapGrowthBytes: Math.max(0, process.memoryUsage().heapUsed - startMemory),
	profiles: { adversarial, clean },
	wallMs: performance.now() - start,
}, null, 2)}\n`)

async function lint(files) {
	const start = performance.now()
	let diagnostics = 0
	for (const file of files) {
		const [result] = await eslint.lintText(file.code, { filePath: file.filePath })
		diagnostics += result.errorCount
	}
	return { diagnostics, files: files.length, wallMs: performance.now() - start }
}
