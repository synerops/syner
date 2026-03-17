// @syner/ops — Operational layer
// friction, self-development, supervisor contracts

export {
  type Category,
  type Proposal,
  type Threshold,
} from './types/changes'

export {
  type Decisions,
  type Decision,
} from './types/supervisor'

export {
  type Friction,
  logFriction,
  readFrictionLog,
} from './friction'

export {
  type Pattern,
  analyzeFriction,
} from './friction-analyzer'

export {
  type Test,
  type TestResult,
  type Evaluation,
  type Metric,
  evaluate,
} from './evaluator'

export {
  type Instance,
  type Invoke,
  type InvokeOptions,
  fetchRemoteAgent,
  invokeRemote,
  invokeAndVerify,
} from './remote'

export { validateRemoteResult } from './boundary'
