// TODO: Migrate to synerops/protocol

export interface Approval {
  approved: boolean
  reason?: string
  approvedBy?: string
  timestamp: Date
}
