import type { Proposal, Threshold } from './types/changes.js'

export interface Test {
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


export interface Evaluation {
  proposal: Proposal
  passed: boolean
  testResults: TestResult[]
  regressions: string[]
  metricResults: Metric[]
}


export interface Metric {
  metric: string
  actual: number
  required: number
  passed: boolean
}


export function evaluate(
  proposal: Proposal,
  testCases: Test[],
  runner: (testCase: Test) => TestResult
): Evaluation {
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

function evaluateMetrics(thresholds: Threshold[], testResults: TestResult[]): Metric[] {
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
