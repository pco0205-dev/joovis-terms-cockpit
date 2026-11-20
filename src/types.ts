export const deckDefinitions = [
  {
    id: 'ai-command',
    label: 'AI 지휘',
    title: 'AI 지휘 학습장',
    helperText: '모호한 지시를 줄이고 GPT/Codex에 명확하게 명령하는 표현을 익히는 공간입니다.',
  },
  {
    id: 'foundry-lab',
    label: '파운드리',
    title: '파운드리 구조 학습장',
    helperText:
      '후보·실험·평가·증거·통합 용어를 익힙니다.',
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
    label: '주비스',
    title: '주비스 구조 학습장',
    helperText: '주비스 본선과 공통 저장소에서 쓰는 데이터·판단·권한·협업 용어를 익힙니다.',
  },
  {
    id: 'investment-analysis',
    label: '투자 구조',
    title: '주비스 투자 구조 학습장',
    helperText:
      '데이터 수집부터 판단·위험·검증·실행 경계까지 익히는 학습용 개념 지도입니다. 비공개 구현 현황이나 매수·매도 추천이 아닙니다.',
  },
  {
    id: 'roblox',
    label: '로블록스',
    title: '로블록스 구조 학습장',
    helperText:
      '로블록스의 클라이언트·서버, 데이터 복제, 출시 후 운영과 창작자 경제 용어를 익힙니다.',
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

export type RecallMode = 'english-korean' | 'korean-english' | 'mechanism'

export type ReviewStatus = 'known' | 'review_again'

export type ArchitectureStatus = 'current' | 'target' | 'concept'

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
  koreanName: string
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
  architectureStatus?: ArchitectureStatus
  statusNote?: string
  mentalModel?: string
  whyItMatters?: string
  withoutIt?: string
  realWorkflow?: string
  relatedTerms?: string[]
}

export type RawDevTerm = Omit<
  DevTerm,
  'koreanName' | 'deck' | 'domainLabel' | 'difficulty' | 'learningPriority' | 'selectionReason'
> &
  Partial<
    Pick<DevTerm, 'koreanName' | 'deck' | 'domainLabel' | 'difficulty' | 'learningPriority' | 'selectionReason'>
  >
