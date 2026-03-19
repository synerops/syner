import { decks } from '@/.source/server'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/decks',
  source: decks.toFumadocsSource(),
})
