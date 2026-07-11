export const deckDefinitions = [
  {
    id: 'ai-command',
    label: 'AI 지휘',
    title: 'AI 지휘 학습장',
    helperText: '모호한 지시를 줄이고 GPT/Codex에 명확하게 명령하는 표현을 익히는 공간입니다.',
  },
  {
    id: 'development',
    label: '개발 기본',
    title: '개발 기본 학습장',
    helperText: '프로그래밍, 터미널, Git, API, DB, 빌드/배포 용어를 익히는 공간입니다.',
  },
  {
    id: 'libraries-tools',
    label: '라이브러리/도구',
    title: '라이브러리/도구 학습장',
    helperText: 'React, Vite, TypeScript, Node.js, Python, 데이터 도구 용어를 익히는 공간입니다.',
  },
  {
    id: 'joovis-architecture',
    label: 'JOOVIS',
    title: 'JOOVIS 아키텍처 학습장',
    helperText: 'JOOVIS 내부 설계 언어와 운영 개념을 분리해서 익히는 공간입니다.',
  },
  {
    id: 'dispute-integration',
    label: '분쟁통합',
    title: '분쟁통합 학습장',
    helperText: '증거관리, 원본대조, 쟁점정리, 인용안전 용어를 익히는 공간입니다.',
  },
] as const

export type DeckId = (typeof deckDefinitions)[number]['id']

export type Difficulty = 'basic' | 'intermediate' | 'advanced'

export type LearningPriority = 'core' | 'working' | 'reference'

export type LearningScope = 'core' | 'all'

export type ReviewStatus = 'known' | 'review_again'

export type ReviewSchedule = {
  nextReviewDate: string
  intervalDays: number
  repetitions: number
  lastReviewedDate: string
}

export type SavedExpression = {
  id: string
  original: string
  improvedKo: string
  improvedEn: string
  createdAt: string
  updatedAt: string
}

export type DevTerm = {
  id: string
  term: string
  pronunciation: string
  koreanMeaning: string
  simpleMeaning: string
  joovisUsage?: string
  checkQuestion: string
  codexPromptExample?: string
  category: string
  deck: DeckId
  domainLabel: string
  difficulty: Difficulty
  learningPriority: LearningPriority
  selectionReason: string
  badExpression?: string
  goodExpression?: string
  gptPromptExample?: string
  disputeUsage?: string
  evidenceCaution?: string
  privacyWarning?: string
  mechanism?: string
  usagePattern?: string
  commonPitfall?: string
  expertNote?: string
  researchBasis?: string
  mentalModel?: string
  whyItMatters?: string
  withoutIt?: string
  realWorkflow?: string
  relatedTerms?: string[]
}

export type RawDevTerm = Omit<
  DevTerm,
  'deck' | 'domainLabel' | 'difficulty' | 'learningPriority' | 'selectionReason'
> &
  Partial<
    Pick<DevTerm, 'deck' | 'domainLabel' | 'difficulty' | 'learningPriority' | 'selectionReason'>
  >
