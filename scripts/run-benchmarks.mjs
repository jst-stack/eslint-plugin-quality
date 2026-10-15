import { ESLint } from 'eslint'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import quality from '../src/index.mjs'

const files = Array.from({ length: 500 }, (_, index) => ({
	code: `export function value${index}(input) { return input?.value ?? ${index} }`,
	filePath: `/fixture/value${index}.js`,
}))
const startMemory = process.memoryUsage().heapUsed
const startCpu = process.cpuUsage()
const start = performance.now()
const eslint = new ESLint({ overrideConfig: quality.configs.recommended, overrideConfigFile: true })

for (const file of files) {
	await eslint.lintText(file.code, { filePath: file.filePath })
}

const cpu = process.cpuUsage(startCpu)
process.stdout.write(`${JSON.stringify({
	cpuMs: (cpu.user + cpu.system) / 1_000,
	files: files.length,
	heapGrowthBytes: Math.max(0, process.memoryUsage().heapUsed - startMemory),
	wallMs: performance.now() - start,
}, null, 2)}\n`)
