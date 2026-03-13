// @syner/ops — Operational layer
// friction, self-development, supervisor contracts

export {
  type Category,
  type Proposal,
  type Threshold,
  /** @deprecated Use Category */ type ChangeCategory,
  /** @deprecated Use Proposal */ type ChangeProposal,
  /** @deprecated Use Threshold */ type MetricThreshold,
} from './types/changes'

export {
  type Decisions,
  type Decision,
  /** @deprecated Import Approval from @syner/osprotocol */ type SupervisorDecision,
  /** @deprecated Use Decisions */ type DecisionCorpus,
} from './types/supervisor'

export {
  type Friction,
  /** @deprecated Use Friction */ type FrictionEvent,
  logFriction,
  readFrictionLog,
} from './friction'

export {
  type Pattern,
  /** @deprecated Use Pattern */ type FrictionPattern,
  analyzeFriction,
} from './friction-analyzer'

export {
  type Test,
  type TestResult,
  type Evaluation,
  type Metric,
  /** @deprecated Use Test */ type TestCase,
  /** @deprecated Use Evaluation */ type EvalResult,
  /** @deprecated Use Metric */ type MetricResult,
  evaluate,
} from './evaluator'

export {
  type Instance,
  type Invoke,
  type InvokeOptions,
  /** @deprecated Use Instance */ type RemoteInstanceCard,
  /** @deprecated Use Invoke */ type RemoteInvokeInput,
  fetchRemoteAgent,
  invokeRemote,
  invokeAndVerify,
} from './remote'

export { validateRemoteResult } from './boundary'
