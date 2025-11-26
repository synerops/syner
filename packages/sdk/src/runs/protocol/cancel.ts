// TODO: Migrate to synerops/protocol

export interface Cancel {
  beforeCancel: () => boolean | Promise<boolean>
  afterCancel: () => void
}
