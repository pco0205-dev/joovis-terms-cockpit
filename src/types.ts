export const categories = [
  'AI Command',
  'Review / QA',
  'Boundary / Safety',
  'Data / Schema',
  'Architecture',
  'Git / Change Control',
  'Runtime / Integration',
  'JOOVIS-Specific',
] as const

export type Category = (typeof categories)[number]

export type ReviewStatus = 'known' | 'review_again'

export type DevTerm = {
  id: string
  term: string
  pronunciation: string
  koreanMeaning: string
  simpleMeaning: string
  joovisUsage: string
  checkQuestion: string
  codexPromptExample: string
  category: Category
}
