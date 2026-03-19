import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

export interface MetricEntry {
  skillRef: string
  metric: string
  value: number
  timestamp: string
}

export interface MetricTimeline {
  skillRef: string
  metric: string
  entries: MetricEntry[]
  trend: 'improving' | 'stable' | 'regressing'
  regression: boolean
}

interface TrackOptions {
  windowDays?: number
  regressionThreshold?: number
}

const DEFAULT_PATH = '.syner/ops/metrics.jsonl'

export async function track(
  skillRef: string,
  options: TrackOptions = {},
  storagePath: string = DEFAULT_PATH
): Promise<MetricTimeline[]> {
  const { windowDays = 30, regressionThreshold = 0.1 } = options

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - windowDays)
  const cutoffISO = cutoff.toISOString()

  const all = await readMetrics(storagePath)
  const entries = all.filter(
    (e) => e.skillRef === skillRef && e.timestamp >= cutoffISO
  )

  // Group by metric name
  const groups = new Map<string, MetricEntry[]>()
  for (const entry of entries) {
    const group = groups.get(entry.metric) ?? []
    group.push(entry)
    groups.set(entry.metric, group)
  }

  const timelines: MetricTimeline[] = []

  for (const [metric, metricEntries] of groups) {
    const sorted = metricEntries.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    )
    const trend = detectTrend(sorted, regressionThreshold)

    timelines.push({
      skillRef,
      metric,
      entries: sorted,
      trend,
      regression: trend === 'regressing',
    })
  }

  return timelines
}

export async function record(
  entry: MetricEntry,
  storagePath: string = DEFAULT_PATH
): Promise<void> {
  await mkdir(dirname(storagePath), { recursive: true })

  const line = JSON.stringify({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  })

  const existing = await readRaw(storagePath)
  const content = existing ? `${existing}\n${line}` : line
  await writeFile(storagePath, content)
}

function detectTrend(
  entries: MetricEntry[],
  threshold: number
): MetricTimeline['trend'] {
  if (entries.length < 2) return 'stable'

  // Compare the average of the first half vs second half
  const mid = Math.floor(entries.length / 2)
  const firstHalf = entries.slice(0, mid)
  const secondHalf = entries.slice(mid)

  const avgFirst = average(firstHalf.map((e) => e.value))
  const avgSecond = average(secondHalf.map((e) => e.value))

  if (avgFirst === 0) return 'stable'

  const change = (avgSecond - avgFirst) / Math.abs(avgFirst)

  if (change < -threshold) return 'regressing'
  if (change > threshold) return 'improving'
  return 'stable'
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

async function readMetrics(storagePath: string): Promise<MetricEntry[]> {
  const raw = await readRaw(storagePath)
  if (!raw) return []

  return raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as MetricEntry)
}

async function readRaw(storagePath: string): Promise<string | null> {
  try {
    return await readFile(storagePath, 'utf-8')
  } catch {
    return null
  }
}
