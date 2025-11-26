// TODO: Migrate to synerops/protocol

export interface Timeout {
  duration: number
  onTimeout: () => void
}
