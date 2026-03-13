import type { ChangeProposal, MetricThreshold } from './types/changes.js'

export interface TestCase {
  name: string
  input: Record<string, unknown>
  expected: Record<string, unknown>
}

export interface TestResult {
  name: string
  passed: boolean
  actual?: Record<string, unknown>
  error?: string
}

export interface EvalResult {
  proposal: ChangeProposal
  passed: boolean
  testResults: TestResult[]
  regressions: string[]
  metricResults: MetricResult[]
}

export interface MetricResult {
  metric: string
  actual: number
  required: number
  passed: boolean
}

export function evaluate(
  proposal: ChangeProposal,
  testCases: TestCase[],
  runner: (testCase: TestCase) => TestResult
): EvalResult {
  const testResults = testCases.map(runner)

  const regressions = testResults
    .filter((r) => !r.passed)
    .map((r) => r.name)

  const metricResults = evaluateMetrics(proposal.metrics, testResults)

  const passed = regressions.length === 0 && metricResults.every((m) => m.passed)

  return {
    proposal,
    passed,
    testResults,
    regressions,
    metricResults,
  }
}

function evaluateMetrics(thresholds: MetricThreshold[], testResults: TestResult[]): MetricResult[] {
  const totalTests = testResults.length
  if (totalTests === 0) return []

  const passedTests = testResults.filter((r) => r.passed).length
  const passRate = passedTests / totalTests

  return thresholds
    .filter((t) => t.metric === 'verification_pass_rate')
    .map((t) => ({
      metric: t.metric,
      actual: passRate,
      required: t.required,
      passed: passRate >= t.required,
    }))
}
